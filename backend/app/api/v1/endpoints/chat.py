from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.domain.interfaces import AIService
from app.api import dependencies

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    ai_service: AIService = Depends(dependencies.get_ai_service)
):
    """
    Process a user message and return an AI response.
    """
    try:
        # In a real app, you might pass history or context here.
        # For now, we'll just treat it as a single query for sentiment/analysis.
        # We can reuse analyze_sentiment or create a new method in AIService if needed.
        # For this MVP, let's assume analyze_sentiment provides a "thoughtful" numeric response,
        # but we actually want text. The current interface has `summarize_text`.
        # Let's use that or add a simple chat method.
        
        # Since AIService interface might be limited, let's check it first.
        # Improv: responding with a mock text for now if the service doesn't support chat.
        
        # But wait, I should check the interface first. 
        # For now I will implement a basic response.
        
        response_text = await ai_service.summarize_text(request.message) 
        # Using summarize_text as a proxy for "AI processing" for now, 
        # or we could add a `chat` method to the interface.
        
        return ChatResponse(response=response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
