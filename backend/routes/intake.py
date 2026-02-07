"""Intake API routes"""
from fastapi import APIRouter, HTTPException
from datetime import datetime
import uuid

from models.schemas import IntakeInput, ReportResponse, ALLOWED_DOMAINS, DiagnosisResult, ReportContent, EvidenceItem
from services import (
    generate_diagnostic_report,
    extract_structure,
    diagnose,
    load_all_playbooks,
    filter_playbooks_by_domain,
    get_playbook_templates,
)

router = APIRouter()


def enhance_report_with_playbooks(report_content: dict, playbooks: list, extraction: dict) -> dict:
    """
    Enhance report content with templates from selected playbooks.
    Prioritizes domain-specific playbooks over general ones.
    """
    # Sort playbooks to put domain-specific ones first (non-general playbooks)
    sorted_playbooks = sorted(
        playbooks,
        key=lambda p: 0 if not p.get("id", "").startswith("general_") else 1
    )
    
    # Get additional templates from playbooks (domain-specific first now)
    playbook_friction = get_playbook_templates(sorted_playbooks, "friction_templates")
    playbook_decisions = get_playbook_templates(sorted_playbooks, "decision_rights_templates")
    playbook_stop_doing = get_playbook_templates(sorted_playbooks, "stop_doing_templates")
    playbook_experiments = get_playbook_templates(sorted_playbooks, "experiment_templates")
    
    # Merge with existing report content (add unique items)
    existing_friction = set(report_content.get("frictionPoints", []))
    existing_decisions = set(report_content.get("decisionRights", []))
    existing_stop = set(report_content.get("stopDoing", []))
    existing_experiments = set(report_content.get("next7DayExperiment", []))
    
    # Add playbook items (limit to avoid overwhelming)
    for item in playbook_friction[:2]:
        if item not in existing_friction:
            report_content["frictionPoints"].append(item)
    
    for item in playbook_decisions[:2]:
        if item not in existing_decisions:
            report_content["decisionRights"].append(item)
    
    for item in playbook_stop_doing[:2]:
        if item not in existing_stop:
            report_content["stopDoing"].append(item)
    
    # Replace experiments with playbook-specific ones if available
    if playbook_experiments:
        report_content["next7DayExperiment"] = playbook_experiments[:3]
    
    return report_content


@router.post("/intake", response_model=ReportResponse)
async def create_intake(intake: IntakeInput):
    """Generate a diagnostic report from intake form data."""
    
    # Validate domain
    if intake.domain.value not in ALLOWED_DOMAINS:
        raise HTTPException(
            status_code=400,
            detail="Invalid domain"
        )
    
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
    
    # Convert intake to dict for extraction
    intake_dict = intake.model_dump()
    intake_dict["domain"] = intake.domain.value  # Ensure string value
    intake_dict["urgencyLevel"] = intake.urgencyLevel.value
    
    # Extract structured data
    extraction = extract_structure(intake_dict)
    
    # Generate diagnosis with confidence and evidence
    diagnosis_result = diagnose(intake_dict, extraction)
    
    # Create DiagnosisResult with evidence items
    evidence_items = [
        EvidenceItem(**e) for e in diagnosis_result.get("evidence", [])
    ]
    
    diagnosis = DiagnosisResult(
        primaryTag=diagnosis_result["primaryTag"],
        secondaryTags=diagnosis_result["secondaryTags"],
        confidence=diagnosis_result.get("confidence", 0.5),
        evidence=evidence_items
    )
    
    # Load and filter playbooks by domain
    all_playbooks = load_all_playbooks()
    eligible_playbooks = filter_playbooks_by_domain(all_playbooks, intake.domain.value)
    
    # Generate base report
    base_report = generate_diagnostic_report(intake)
    report_dict = base_report.model_dump()
    
    # Enhance report with playbook templates
    enhanced_report = enhance_report_with_playbooks(report_dict, eligible_playbooks, extraction)
    
    # Create enhanced ReportContent from the modified dict
    final_report = ReportContent(**enhanced_report)
    
    # Generate response
    report_id = str(uuid.uuid4())
    created_at = datetime.utcnow().isoformat() + "Z"
    
    return ReportResponse(
        reportId=report_id,
        createdAt=created_at,
        intake=intake_dict,
        extraction=extraction,
        diagnosis=diagnosis,
        report=final_report,
        pdfUrl=None,
    )
