"""Reports API routes"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List

from models.schemas import SaveReportInput, ReportListItem
from services import ReportRepository

router = APIRouter()


def get_report_repository():
    """Dependency to get report repository"""
    from server import db
    return ReportRepository(db)


@router.post("/reports/save")
async def save_report(
    data: SaveReportInput,
    repo: ReportRepository = Depends(get_report_repository)
):
    """Save a generated report to the database."""
    await repo.save(data)
    return {"ok": True}


@router.get("/reports", response_model=List[ReportListItem])
async def list_reports(
    repo: ReportRepository = Depends(get_report_repository)
):
    """Get list of all saved reports."""
    return await repo.get_list()


@router.get("/reports/{report_id}")
async def get_report(
    report_id: str,
    repo: ReportRepository = Depends(get_report_repository)
):
    """Get a single saved report by ID."""
    report = await repo.get_by_id(report_id)
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return {
        "id": str(report["_id"]),
        "reportId": report.get("reportId"),
        "intake": report.get("intake"),
        "report": report.get("report"),
        "createdAt": report.get("createdAt"),
        "pdfUrl": report.get("pdfUrl"),
    }
