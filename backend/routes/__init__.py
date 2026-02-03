"""Routes package"""
from fastapi import APIRouter
from .intake import router as intake_router
from .reports import router as reports_router

# Create main API router
api_router = APIRouter(prefix="/api")

# Include sub-routers
api_router.include_router(intake_router, tags=["intake"])
api_router.include_router(reports_router, tags=["reports"])


@api_router.get("/")
async def root():
    """API root endpoint"""
    return {"message": "Handoff Diagnostic API", "version": "1.0.0"}
