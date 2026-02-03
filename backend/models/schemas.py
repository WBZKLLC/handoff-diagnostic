"""Pydantic models for the Handoff Diagnostic API"""
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class UrgencyLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class IntakeInput(BaseModel):
    """Input model for workflow intake form"""
    companyName: str = Field(..., min_length=1, description="Company name")
    workflowName: str = Field(..., min_length=1, description="Name of the workflow")
    workflowDescription: str = Field(..., min_length=1, description="Description of the workflow")
    rolesInvolved: str = Field(..., min_length=1, description="Comma-separated list of roles")
    toolsUsed: str = Field(..., min_length=1, description="Comma-separated list of tools")
    whereItGetsStuck: str = Field(..., min_length=1, description="Where friction occurs")
    desiredOutcome: str = Field(..., min_length=1, description="Desired outcome")
    urgencyLevel: UrgencyLevel = Field(..., description="Urgency level")
    contactEmail: Optional[str] = Field(None, description="Optional contact email")


class ReportContent(BaseModel):
    """Generated report content"""
    summary: str
    handoffMap: List[str]
    frictionPoints: List[str]
    decisionRights: List[str]
    stopDoing: List[str]
    next7DayExperiment: List[str]


class ReportResponse(BaseModel):
    """Response model for generated report"""
    reportId: str
    createdAt: str
    report: ReportContent
    pdfUrl: Optional[str] = None


class SaveReportInput(BaseModel):
    """Input model for saving a report"""
    reportId: str
    intake: IntakeInput
    report: ReportContent
    createdAt: str
    pdfUrl: Optional[str] = None


class ReportListItem(BaseModel):
    """List item for saved reports"""
    id: str
    workflowName: str
    createdAt: str


class SavedReport(BaseModel):
    """Full saved report model"""
    id: str
    reportId: str
    intake: IntakeInput
    report: ReportContent
    createdAt: str
    pdfUrl: Optional[str] = None
