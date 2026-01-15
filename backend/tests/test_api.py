import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

@pytest.mark.asyncio
async def test_read_news():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/v1/news/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "title" in data[0]

@pytest.mark.asyncio
async def test_market_websocket():
    # WebSocket testing requires TestClient or specific async setup
    # For MVP we skip complex WS testing in this file
    pass
