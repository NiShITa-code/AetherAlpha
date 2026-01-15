from app.domain.interfaces import AIService
from app.core.config import settings
from app.core.logger import logger
import random

class AIServiceImpl(AIService):
    async def analyze_sentiment(self, text: str) -> float:
        if settings.USE_MOCK_DATA or not settings.OPENAI_API_KEY:
            logger.info("Using Mock AI Sentiment")
            # Simulate processing time or random sentiment
            return round(random.uniform(-1.0, 1.0), 2)
        
        # Real OpenAI Call would go here
        return 0.0

    async def summarize_text(self, text: str) -> str:
        if settings.USE_MOCK_DATA or not settings.OPENAI_API_KEY:
            return "This is an AI generated summary of the news article (Mock Mode)."
        
        return "Real summary pending implementation."
