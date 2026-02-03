from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ==================== MODELS ====================

class IntakeInput(BaseModel):
    companyName: str
    workflowName: str
    workflowDescription: str
    rolesInvolved: str
    toolsUsed: str
    whereItGetsStuck: str
    desiredOutcome: str
    urgencyLevel: str  # Low, Medium, High
    contactEmail: Optional[str] = None


class ReportContent(BaseModel):
    summary: str
    handoffMap: List[str]
    frictionPoints: List[str]
    decisionRights: List[str]
    stopDoing: List[str]
    next7DayExperiment: List[str]


class ReportResponse(BaseModel):
    reportId: str
    createdAt: str
    report: ReportContent
    pdfUrl: Optional[str] = None


class SaveReportInput(BaseModel):
    reportId: str
    intake: IntakeInput
    report: ReportContent
    createdAt: str
    pdfUrl: Optional[str] = None


class ReportListItem(BaseModel):
    id: str
    workflowName: str
    createdAt: str


class SavedReport(BaseModel):
    id: str
    reportId: str
    intake: IntakeInput
    report: ReportContent
    createdAt: str
    pdfUrl: Optional[str] = None


# ==================== REPORT GENERATION LOGIC ====================

def generate_report(intake: IntakeInput) -> ReportContent:
    """Generate a deterministic diagnostic report from intake data."""
    
    # Parse roles and tools
    roles = [r.strip() for r in intake.rolesInvolved.split(',') if r.strip()]
    tools = [t.strip() for t in intake.toolsUsed.split(',') if t.strip()]
    
    # Generate Summary
    summary = f"The {intake.workflowName} workflow at {intake.companyName} involves {len(roles)} key roles working across {len(tools)} tools. {intake.workflowDescription[:200]}{'...' if len(intake.workflowDescription) > 200 else ''} The desired outcome is: {intake.desiredOutcome[:150]}{'...' if len(intake.desiredOutcome) > 150 else ''}"
    
    # Generate Handoff Map
    handoff_artifacts = ["status update", "approval request", "data handoff", "task assignment", "review feedback"]
    handoff_map = []
    for i in range(len(roles) - 1):
        artifact = handoff_artifacts[i % len(handoff_artifacts)]
        handoff_map.append(f"{roles[i]} → {roles[i+1]}: {artifact}")
    if len(roles) > 1:
        handoff_map.append(f"{roles[-1]} → {roles[0]}: completion notification")
    elif len(roles) == 1:
        handoff_map.append(f"{roles[0]} → Self: task completion checkpoint")
    else:
        handoff_map.append("No roles specified - define clear ownership")
    
    # Generate Friction Points based on whereItGetsStuck and urgencyLevel
    urgency_modifier = {
        "High": "critically impacting",
        "Medium": "moderately affecting",
        "Low": "occasionally disrupting"
    }
    modifier = urgency_modifier.get(intake.urgencyLevel, "affecting")
    
    friction_points = [
        f"Handoff gap: {intake.whereItGetsStuck[:100]}{'...' if len(intake.whereItGetsStuck) > 100 else ''}",
        f"Tool fragmentation across {', '.join(tools[:3])}{'...' if len(tools) > 3 else ''} is {modifier} workflow continuity",
        f"Unclear ownership between {' and '.join(roles[:2]) if len(roles) >= 2 else roles[0] if roles else 'team members'} at critical decision points",
        f"Missing feedback loops causing delays in the {intake.workflowName} process",
        f"Information silos preventing visibility into workflow status"
    ]
    
    # Generate Decision Rights Clarifier
    decision_rights = [
        f"Priority conflicts: {roles[0] if roles else 'Team lead'} should have final say on sequencing",
        f"Approval gating: Define SLA for {roles[1] if len(roles) > 1 else 'approver'} response time (suggest 24h max)",
        f"Exception handling: Escalation path should bypass normal flow when urgency is {intake.urgencyLevel}",
        f"Resource allocation: {roles[-1] if roles else 'Manager'} owns capacity decisions",
        "Scope changes: Require written approval before modifying workflow mid-stream"
    ]
    
    # Generate Stop-Doing List
    stop_doing = [
        "Stop adding more status meetings - they mask the real handoff problems",
        "Stop creating duplicate trackers across tools - consolidate to single source of truth",
        "Stop sending 'just checking in' pings - implement pull-based status updates instead",
        "Stop cc'ing everyone on emails - define explicit communication channels per handoff",
        "Stop waiting for perfect information - set decision timeboxes with available data"
    ]
    
    # Generate Next 7-Day Experiment
    next_7day = [
        f"Day 1-2: Assign single owner ({roles[0] if roles else 'designated person'}) to track one complete workflow cycle end-to-end",
        f"Day 3-5: Create a one-page checklist for the {roles[0] if roles else 'owner'} → {roles[1] if len(roles) > 1 else 'next step'} handoff with 3 required items",
        f"Day 6-7: Implement one decision rule: 'If no response in 4 hours, {roles[-1] if roles else 'owner'} decides and documents'"
    ]
    
    return ReportContent(
        summary=summary,
        handoffMap=handoff_map,
        frictionPoints=friction_points,
        decisionRights=decision_rights,
        stopDoing=stop_doing,
        next7DayExperiment=next_7day
    )


# ==================== API ENDPOINTS ====================

@api_router.get("/")
async def root():
    return {"message": "Handoff Diagnostic API"}


@api_router.post("/intake", response_model=ReportResponse)
async def create_intake(intake: IntakeInput):
    """Generate a diagnostic report from intake form data."""
    
    # Validate required fields
    required_fields = [
        ('companyName', intake.companyName),
        ('workflowName', intake.workflowName),
        ('workflowDescription', intake.workflowDescription),
        ('rolesInvolved', intake.rolesInvolved),
        ('toolsUsed', intake.toolsUsed),
        ('whereItGetsStuck', intake.whereItGetsStuck),
        ('desiredOutcome', intake.desiredOutcome),
        ('urgencyLevel', intake.urgencyLevel),
    ]
    
    missing = [name for name, value in required_fields if not value or not value.strip()]
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required fields: {', '.join(missing)}"
        )
    
    if intake.urgencyLevel not in ['Low', 'Medium', 'High']:
        raise HTTPException(
            status_code=400,
            detail="urgencyLevel must be one of: Low, Medium, High"
        )
    
    # Generate report
    report_id = str(uuid.uuid4())
    created_at = datetime.utcnow().isoformat() + "Z"
    report = generate_report(intake)
    
    return ReportResponse(
        reportId=report_id,
        createdAt=created_at,
        report=report,
        pdfUrl=None  # PDF generation in Phase 2
    )


@api_router.post("/reports/save")
async def save_report(data: SaveReportInput):
    """Save a generated report to the database."""
    
    doc = {
        "_id": data.reportId,
        "reportId": data.reportId,
        "intake": data.intake.dict(),
        "report": data.report.dict(),
        "createdAt": data.createdAt,
        "pdfUrl": data.pdfUrl
    }
    
    # Upsert - update if exists, insert if not
    await db.diagnostic_reports.replace_one(
        {"_id": data.reportId},
        doc,
        upsert=True
    )
    
    return {"ok": True}


@api_router.get("/reports", response_model=List[ReportListItem])
async def list_reports():
    """Get list of all saved reports."""
    
    reports = await db.diagnostic_reports.find(
        {},
        {"_id": 1, "intake.workflowName": 1, "createdAt": 1}
    ).sort("createdAt", -1).to_list(1000)
    
    return [
        ReportListItem(
            id=str(r["_id"]),
            workflowName=r.get("intake", {}).get("workflowName", "Unknown"),
            createdAt=r.get("createdAt", "")
        )
        for r in reports
    ]


@api_router.get("/reports/{report_id}")
async def get_report(report_id: str):
    """Get a single saved report by ID."""
    
    report = await db.diagnostic_reports.find_one({"_id": report_id})
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return {
        "id": str(report["_id"]),
        "reportId": report.get("reportId"),
        "intake": report.get("intake"),
        "report": report.get("report"),
        "createdAt": report.get("createdAt"),
        "pdfUrl": report.get("pdfUrl")
    }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
