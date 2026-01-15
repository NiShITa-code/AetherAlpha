from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR

class InfrastructureError(Exception):
    """Base class for infrastructure layer errors"""
    pass

class ExternalServiceError(InfrastructureError):
    """Raised when an external API (News, AI) fails"""
    pass

async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler to ensure all errors return JSON
    and sensitive details are hidden in production.
    """
    # In a real app, we would log the full stack trace here via structlog
    print(f"Global Exception: {exc}")
    
    return JSONResponse(
        status_code=HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal Server Error", "path": str(request.url)},
    )

async def infrastructure_exception_handler(request: Request, exc: InfrastructureError):
    return JSONResponse(
        status_code=503,
        content={"detail": str(exc), "type": "InfrastructureError"},
    )
