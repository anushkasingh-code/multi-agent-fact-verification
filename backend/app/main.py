"""
FastAPI Application Entrypoint.
"""

from fastapi import FastAPI

from app.api.v1.router import api_router

app = FastAPI(
    title="Autonomous Multi-Agent Research & Fact Verification System",
    version="1.0.0",
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    """
    Root API health check and documentation reference endpoint.
    """
    return {
        "message": "Autonomous Multi-Agent Research & Fact Verification API",
        "docs": "/docs",
    }
