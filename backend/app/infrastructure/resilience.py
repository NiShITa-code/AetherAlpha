import pybreaker
from app.core.logger import logger

class LogListener(pybreaker.CircuitBreakerListener):
    def state_change(self, cb, old_state, new_state):
        logger.warning(
            f"Circuit Breaker '{cb.name}' changed state: {old_state.name} -> {new_state.name}"
        )

# Circuit Breaker for Market Data (CoinGecko)
# Trips if 3 failures occur. Resets after 60 seconds.
market_breaker = pybreaker.CircuitBreaker(
    fail_max=3,
    reset_timeout=60,
    name="market_api",
    listeners=[LogListener()]
)

# Circuit Breaker for News Data (NewsAPI)
# Trips if 3 failures occur. Resets after 60 seconds.
news_breaker = pybreaker.CircuitBreaker(
    fail_max=3,
    reset_timeout=60,
    name="news_api",
    listeners=[LogListener()]
)
