"""Intake API routes"""
from fastapi import APIRouter, HTTPException
from datetime import datetime
import uuid

from models.schemas import IntakeInput, ReportResponse
from services import generate_diagnostic_report

router = APIRouter()


@router.post("/intake", response_model=ReportResponse)
async def create_intake(intake: IntakeInput):
    """Generate a diagnostic report from intake form data."""
    
    # Validate required fields (Pydantic handles most validation)
    required_fields = [
        ('companyName', intake.companyName),
        ('workflowName', intake.workflowName),
        ('workflowDescription', intake.workflowDescription),
        ('rolesInvolved', intake.rolesInvolved),
        ('toolsUsed', intake.toolsUsed),
        ('whereItGetsStuck', intake.whereItGetsStuck),
        ('desiredOutcome', intake.desiredOutcome),
    ]
    
    missing = [name for name, value in required_fields if not value or not value.strip()]
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required fields: {', '.join(missing)}"
        )
    
    # Generate report
    report_id = str(uuid.uuid4())
    created_at = datetime.utcnow().isoformat() + "Z"
    report = generate_diagnostic_report(intake)
    
    return ReportResponse(
        reportId=report_id,
        createdAt=created_at,
        report=report,
        pdfUrl=None,  # PDF generation in Phase 2
    )
