from fastapi import APIRouter
from app.api.v1.endpoints import news, market, chat

api_router = APIRouter()
api_router.include_router(news.router, prefix="/news", tags=["news"])
api_router.include_router(market.router, prefix="/market", tags=["market"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
