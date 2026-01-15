import random
import asyncio
import httpx
from typing import Dict, List
from datetime import datetime
from app.domain.interfaces import MarketDataProvider
import pybreaker
from app.domain.models import MarketTicker
from app.core.config import settings
from app.infrastructure.resilience import market_breaker

class MarketDataProviderImpl(MarketDataProvider):
    def __init__(self):
        self._tickers: Dict[str, float] = {
            "BTC-USD": 45000.00,
            "ETH-USD": 2800.00,
            "NG=F": 2.50, # Natural Gas
            "CL=F": 75.00 # Crude Oil
        }

    async def get_latest_price(self, symbol: str) -> float:
        if settings.USE_MOCK_DATA:
            return self._get_mock_price(symbol)

        # Map common symbols to CoinGecko IDs
        symbol_map = {
            "BTC-USD": "bitcoin",
            "ETH-USD": "ethereum",
            "SOL-USD": "solana",
            "DOGE-USD": "dogecoin",
        }
        
        coin_id = symbol_map.get(symbol)
        if not coin_id:
            # Fallback to mock for unknown symbols in MVP
            return self._get_mock_price(symbol)

        try:
            # Circuit Breaker wraps the external call
            async def _fetch():
                async with httpx.AsyncClient() as client:
                    response = await client.get(
                        f"https://api.coingecko.com/api/v3/simple/price?ids={coin_id}&vs_currencies=usd",
                        timeout=5.0
                    )
                    response.raise_for_status()
                    return response

            # If Circuit is OPEN, this raises CircuitBreakerError immediately
            response = await market_breaker.call(_fetch)
            
            data = response.json()
            price = data.get(coin_id, {}).get("usd")
            if price:
                return float(price)

        except pybreaker.CircuitBreakerError:
            print(f"Circuit OPEN for Market Data. Using Fallback.")
            # Fallthrough to mock
        except Exception as e:
            # Fallback to mock on error (Resilience)
            print(f"CoinGecko Error: {e}, using fallback.")
            
        return self._get_mock_price(symbol)

    def _get_mock_price(self, symbol: str) -> float:
        current = self._tickers.get(symbol, 1000.0)
        change = random.uniform(-0.005, 0.005) * current
        new_price = round(current + change, 2)
        self._tickers[symbol] = new_price
        return new_price

    async def generate_ticker(self, symbol: str) -> MarketTicker:
        price = await self.get_latest_price(symbol)
        return MarketTicker(
            symbol=symbol,
            price=price,
            timestamp=datetime.utcnow(),
            change_24h=round(random.uniform(-5.0, 5.0), 2),
            volume=round(random.uniform(1000, 50000), 2)
        )

    async def get_price_history(self, symbol: str, days: int) -> List[MarketTicker]:
        if settings.USE_MOCK_DATA:
            return self._get_mock_history(symbol, days)

        symbol_map = {
            "BTC-USD": "bitcoin",
            "ETH-USD": "ethereum",
            "SOL-USD": "solana",
            "DOGE-USD": "dogecoin",
        }
        coin_id = symbol_map.get(symbol)
        
        if not coin_id:
             return self._get_mock_history(symbol, days)

        try:
             async def _fetch():
                async with httpx.AsyncClient() as client:
                    response = await client.get(
                        f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart?vs_currency=usd&days={days}",
                        timeout=10.0
                    )
                    response.raise_for_status()
                    return response

             response = await market_breaker.call(_fetch)
             data = response.json()
             prices = data.get("prices", [])
             
             history = []
             for p in prices:
                 # CoinGecko returns [timestamp_ms, price]
                 ts = datetime.fromtimestamp(p[0] / 1000)
                 history.append(MarketTicker(
                     symbol=symbol,
                     price=float(p[1]),
                     timestamp=ts,
                     change_24h=0.0, # Not provided in history
                     volume=0.0
                 ))
             return history

        except Exception as e:
            print(f"History Fetch Error: {e}")
            return self._get_mock_history(symbol, days)

    def _get_mock_history(self, symbol: str, days: int) -> List[MarketTicker]:
        history = []
        base_price = self._tickers.get(symbol, 1000.0)
        now = datetime.utcnow()
        points = 24 if days == 1 else days # 1 point per hour for 1 day, or 1 point per day
        
        from datetime import timedelta
        for i in range(points):
            t = now - timedelta(hours=(points - i) if days == 1 else (points - i) * 24)
            price = base_price * (1 + random.uniform(-0.1, 0.1))
            history.append(MarketTicker(
                symbol=symbol,
                price=round(price, 2),
                timestamp=t,
                change_24h=0.0,
                volume=0.0
            ))
        return history
