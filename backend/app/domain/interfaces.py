from typing import Protocol, List
from app.domain.models import NewsItem, MarketTicker

class NewsClient(Protocol):
    async def fetch_latest_news(self, limit: int = 10) -> List[NewsItem]:
        ...

class AIService(Protocol):
    async def analyze_sentiment(self, text: str) -> float:
        ...
    
    async def summarize_text(self, text: str) -> str:
        ...

class MarketDataProvider(Protocol):
    async def get_latest_price(self, symbol: str) -> float:
        ...

    async def get_price_history(self, symbol: str, days: int) -> List[MarketTicker]:
        ...
