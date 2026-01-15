from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
import asyncio
import json
from dataclasses import asdict
from app.api import dependencies
from app.domain.interfaces import MarketDataProvider
from app.core.logger import logger

router = APIRouter()

@router.get("/history/{symbol}")
async def get_history(
    symbol: str,
    days: int = 1,
    market_provider: MarketDataProvider = Depends(dependencies.get_market_provider)
):
    """
    Get historical price data.
    """
    history = await market_provider.get_price_history(symbol, days)
    # Serialize results
    results = []
    for item in history:
        d = asdict(item)
        d["timestamp"] = d["timestamp"].isoformat()
        results.append(d)
    return results

@router.websocket("/ws/{symbol}")
async def websocket_endpoint(
    websocket: WebSocket,
    symbol: str,
    market_provider: MarketDataProvider = Depends(dependencies.get_market_provider)
):
    """
    Streams real-time market data for a given symbol.
    """
    await websocket.accept()
    logger.info(f"WebSocket connected for {symbol}")
    
    try:
        while True:
            # Generate ticker data
            ticker = await market_provider.generate_ticker(symbol)
            data = asdict(ticker)
            # Serialize datetime
            data["timestamp"] = data["timestamp"].isoformat()
            
            await websocket.send_json(data)
            
            # Real API has rate limits (CoinGecko free: ~10-30 req/min)
            await asyncio.sleep(5.0)
            
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for {symbol}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await websocket.close()
