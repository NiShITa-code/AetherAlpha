from functools import lru_cache
from typing import Generator
from app.domain.interfaces import NewsClient, AIService, MarketDataProvider
from app.infrastructure.external.news_client import NewsClientImpl
from app.infrastructure.external.openai_client import AIServiceImpl
from app.infrastructure.external.market_client import MarketDataProviderImpl

@lru_cache()
def get_news_client() -> NewsClient:
    return NewsClientImpl()

@lru_cache()
def get_ai_service() -> AIService:
    return AIServiceImpl()

@lru_cache()
def get_market_provider() -> MarketDataProvider:
    return MarketDataProviderImpl()
