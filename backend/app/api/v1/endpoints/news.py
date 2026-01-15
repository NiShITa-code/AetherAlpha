from fastapi import APIRouter, Depends, HTTPException
from typing import List, Any
from app.domain.models import NewsItem
from app.api import dependencies
from app.domain.interfaces import NewsClient, AIService

router = APIRouter()

@router.get("/", response_model=List[NewsItem])
async def read_news(
    limit: int = 10,
    news_client: NewsClient = Depends(dependencies.get_news_client),
    ai_service: AIService = Depends(dependencies.get_ai_service)
) -> Any:
    """
    Retrieve latest financial news with AI sentiment analysis.
    """
    news_items = await news_client.fetch_latest_news(limit=limit)
    
    # Enrich with AI if needed? 
    # The client might fetch already enriched news OR we do it here.
    # For MVP, assume client returns already enriched or we do a quick pass.
    # Let's assume client handles it or returns mock data.
    
    return news_items

@router.get("/{news_id}/analyze")
async def analyze_news_item(
    news_id: str,
    ai_service: AIService = Depends(dependencies.get_ai_service)
):
    """
    On-demand analysis of a specific news item (stub).
    """
    # Logic to fetch text by ID (omitted for MVP, using mock text)
    mock_text = "Market is crashing due to unexpected inflation data."
    sentiment = await ai_service.analyze_sentiment(mock_text)
    return {"id": news_id, "sentiment": sentiment}
