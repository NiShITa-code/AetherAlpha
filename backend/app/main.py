from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logger import setup_logging
from app.core.exceptions import global_exception_handler, infrastructure_exception_handler, InfrastructureError

# Setup Logging
setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Exception Handlers
app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(InfrastructureError, infrastructure_exception_handler)

from app.api.api import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
async def health_check():
    return {"status": "ok", "version": settings.VERSION}

@app.get("/")
async def root():
    return {"message": "Welcome to AetherAlpha API"}
