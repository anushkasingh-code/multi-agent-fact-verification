"""
FastAPI Application Entrypoint.
Configured with CORS middleware, global exception handlers, and routing.
"""

import logging
from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Autonomous Multi-Agent Research & Fact Verification System",
    version="1.0.0",
)

# CORS Middleware configuration for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handles request payload validation errors gracefully with structured JSON.
    """
    logger.warning(f"Validation error for request {request.url}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "status": "error",
            "message": "Invalid request payload",
            "details": jsonable_encoder(exc.errors()),
        },
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception fallback handler to prevent unhandled 500 server crashes.
    """
    logger.error(f"Unhandled server error processing {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "message": "An unexpected server error occurred during processing.",
            "detail": str(exc),
        },
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
