"""Report generation service"""
from models.schemas import IntakeInput, ReportContent
from templates import (
    generate_summary,
    generate_handoff_map,
    generate_friction_points,
    generate_decision_rights,
    generate_7day_experiment,
    STOP_DOING_TEMPLATES,
)


def parse_comma_separated(text: str) -> list:
    """Parse comma-separated string into list"""
    return [item.strip() for item in text.split(',') if item.strip()]


def generate_diagnostic_report(intake: IntakeInput) -> ReportContent:
    """Generate a complete diagnostic report from intake data."""
    # Parse roles and tools
    roles = parse_comma_separated(intake.rolesInvolved)
    tools = parse_comma_separated(intake.toolsUsed)
    
    # Generate each section
    summary = generate_summary(
        workflow_name=intake.workflowName,
        company_name=intake.companyName,
        description=intake.workflowDescription,
        desired_outcome=intake.desiredOutcome,
        role_count=len(roles),
        tool_count=len(tools),
    )
    
    handoff_map = generate_handoff_map(roles)
    
    friction_points = generate_friction_points(
        where_stuck=intake.whereItGetsStuck,
        urgency=intake.urgencyLevel.value,
        tools=tools,
        roles=roles,
        workflow_name=intake.workflowName,
    )
    
    decision_rights = generate_decision_rights(roles, intake.urgencyLevel.value)
    
    next_7day = generate_7day_experiment(roles)
    
    return ReportContent(
        summary=summary,
        handoffMap=handoff_map,
        frictionPoints=friction_points,
        decisionRights=decision_rights,
        stopDoing=STOP_DOING_TEMPLATES.copy(),
        next7DayExperiment=next_7day,
    )
