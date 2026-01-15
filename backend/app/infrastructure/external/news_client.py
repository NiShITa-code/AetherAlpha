import httpx
from typing import List
from datetime import datetime
from tenacity import retry, stop_after_attempt, wait_exponential

from app.domain.interfaces import NewsClient
from app.domain.models import NewsItem
from app.core.config import settings
from app.core.logger import logger
from app.infrastructure.resilience import news_breaker
import pybreaker

class NewsClientImpl(NewsClient):
    def __init__(self):
        self.mock_news = [
            NewsItem(
                id="1",
                title="Oil prices surge as geopolitical tensions rise in Eastern Europe",
                url="https://example.com/news/1",
                source="Bloomberg Energy",
                published_at=datetime.utcnow(),
                summary="Crude oil futures jumped 5%...",
                sentiment_score=-0.8,
                sentiment_label="Bearish" # High prices bad for economy? Or Bullish for Oil? Context matters. Let's say Bearish for market.
            ),
            NewsItem(
                id="2",
                title="European Green Deal prompts massive investment in Solar",
                url="https://example.com/news/2",
                source="Reuters",
                published_at=datetime.utcnow(),
                summary="EU Commission approves €50B fund...",
                sentiment_score=0.9,
                sentiment_label="Bullish"
            )
        ]

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10),
        reraise=False # Don't crash app, return empty/mock
    )
    async def fetch_latest_news(self, limit: int = 10) -> List[NewsItem]:
        if settings.USE_MOCK_DATA or not settings.NEWS_API_KEY:
            logger.info("Fetching mock news data (Mock Mode or No Key)")
            return self.mock_news

        try:
            # Circuit Breaker wraps the external call
            async def _fetch():
                async with httpx.AsyncClient() as client:
                    response = await client.get(
                        f"https://newsapi.org/v2/everything?q=crypto&sortBy=publishedAt&language=en&pageSize={limit}&apiKey={settings.NEWS_API_KEY}",
                        timeout=5.0
                    )
                    response.raise_for_status()
                    return response

            response = await news_breaker.call(_fetch)
            data = response.json()
            
            start_id = int(datetime.utcnow().timestamp())
            return [
                NewsItem(
                    id=str(start_id + i),
                    title=article.get('title'),
                    url=article.get('url'),
                    source=article.get('source', {}).get('name', 'Unknown'),
                    published_at=datetime.utcnow(), # Simplify for MVP
                    summary=article.get('description') or "No summary available.",
                    sentiment_score=0.0, # Placeholder awaiting AI
                    sentiment_label="Neutral"
                ) for i, article in enumerate(data.get('articles', []))
            ]
            
        except pybreaker.CircuitBreakerError:
            logger.warning("Circuit OPEN for News API. Using Fallback.")
            return self.mock_news
        except Exception as e:
            logger.error(f"Failed to fetch news: {e}")
            return self.mock_news # Fallback to mock logic
