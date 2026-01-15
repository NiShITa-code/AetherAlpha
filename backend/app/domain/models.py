from dataclasses import dataclass
from datetime import datetime
from typing import Optional, List

@dataclass
class NewsItem:
    id: str
    title: str
    url: str
    source: str
    published_at: datetime
    summary: Optional[str] = None
    sentiment_score: float = 0.0  # -1.0 (Bearish) to 1.0 (Bullish)
    sentiment_label: str = "Neutral" # Bearish, Neutral, Bullish

@dataclass
class MarketTicker:
    symbol: str
    price: float
    timestamp: datetime
    change_24h: float
    volume: float
