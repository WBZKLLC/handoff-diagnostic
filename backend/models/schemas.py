"""Pydantic models for the Handoff Diagnostic API"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum


class UrgencyLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class DomainType(str, Enum):
    GENERAL = "general"
    LOGISTICS = "logistics"
    HEALTHCARE = "healthcare"
    FINANCE = "finance"
    SAAS = "saas"
    MANUFACTURING = "manufacturing"
    PUBLIC = "public"
    OTHER = "other"


ALLOWED_DOMAINS = [d.value for d in DomainType]


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
    domain: DomainType = Field(..., description="Business domain")
    contactEmail: Optional[str] = Field(None, description="Optional contact email")


# Extraction schema models
class StepModel(BaseModel):
    id: str
    actor: str
    action: str
    inputs: List[str]
    outputs: List[str]
    next: List[str]


class HandoffModel(BaseModel):
    from_role: str = Field(..., alias="from")
    to: str
    artifact: str
    channel: str

    class Config:
        populate_by_name = True


class DecisionPointModel(BaseModel):
    when: str
    owner: str
    options: List[str]


class WaitStateModel(BaseModel):
    where: str
    cause: str
    owner: str


class ExceptionModel(BaseModel):
    trigger: str
    current_behavior: str
    desired_behavior: str


class ExtractionResult(BaseModel):
    domain: str
    roles: List[str]
    systems: List[str]
    artifacts: List[str]
    steps: List[StepModel]
    handoffs: List[Dict[str, Any]]
    decision_points: List[DecisionPointModel]
    wait_states: List[WaitStateModel]
    exceptions: List[ExceptionModel]


class EvidenceItem(BaseModel):
    """Evidence snippet for diagnosis"""
    field: str
    snippet: str
    tag: str


class DiagnosisResult(BaseModel):
    """Diagnosis result with confidence and evidence"""
    primaryTag: str
    secondaryTags: List[str]
    confidence: float = Field(default=0.5, ge=0.0, le=1.0)
    evidence: List[EvidenceItem] = Field(default_factory=list)


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
    intake: Dict[str, Any]
    extraction: Dict[str, Any]
    diagnosis: DiagnosisResult
    report: ReportContent
    pdfUrl: Optional[str] = None


class SaveReportInput(BaseModel):
    """Input model for saving a report"""
    reportId: str
    intake: Dict[str, Any]
    extraction: Optional[Dict[str, Any]] = None
    diagnosis: Optional[Dict[str, Any]] = None
    report: ReportContent
    createdAt: str
    pdfUrl: Optional[str] = None


class ReportListItem(BaseModel):
    """List item for saved reports"""
    id: str
    workflowName: str
    createdAt: str
    domain: Optional[str] = None


class SavedReport(BaseModel):
    """Full saved report model"""
    id: str
    reportId: str
    intake: Dict[str, Any]
    extraction: Optional[Dict[str, Any]] = None
    diagnosis: Optional[Dict[str, Any]] = None
    report: ReportContent
    createdAt: str
    pdfUrl: Optional[str] = None
