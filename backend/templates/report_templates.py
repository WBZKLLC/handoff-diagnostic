"""Report generation templates and logic"""
from typing import List, Dict

# Handoff artifact templates
HANDOFF_ARTIFACTS = [
    "status update",
    "approval request",
    "data handoff",
    "task assignment",
    "review feedback",
]

# Urgency level modifiers for friction points
URGENCY_MODIFIERS: Dict[str, str] = {
    "High": "critically impacting",
    "Medium": "moderately affecting",
    "Low": "occasionally disrupting",
}

# Stop-doing list templates
STOP_DOING_TEMPLATES: List[str] = [
    "Stop adding more status meetings - they mask the real handoff problems",
    "Stop creating duplicate trackers across tools - consolidate to single source of truth",
    "Stop sending 'just checking in' pings - implement pull-based status updates instead",
    "Stop cc'ing everyone on emails - define explicit communication channels per handoff",
    "Stop waiting for perfect information - set decision timeboxes with available data",
]


def generate_summary(workflow_name: str, company_name: str, description: str, 
                     desired_outcome: str, role_count: int, tool_count: int) -> str:
    """Generate a summary paragraph"""
    desc_truncated = description[:200] + ('...' if len(description) > 200 else '')
    outcome_truncated = desired_outcome[:150] + ('...' if len(desired_outcome) > 150 else '')
    
    return (
        f"The {workflow_name} workflow at {company_name} involves {role_count} key roles "
        f"working across {tool_count} tools. {desc_truncated} "
        f"The desired outcome is: {outcome_truncated}"
    )


def generate_handoff_map(roles: List[str]) -> List[str]:
    """Generate handoff map from roles"""
    if not roles:
        return ["No roles specified - define clear ownership"]
    
    handoff_map = []
    for i in range(len(roles) - 1):
        artifact = HANDOFF_ARTIFACTS[i % len(HANDOFF_ARTIFACTS)]
        handoff_map.append(f"{roles[i]} \u2192 {roles[i+1]}: {artifact}")
    
    if len(roles) > 1:
        handoff_map.append(f"{roles[-1]} \u2192 {roles[0]}: completion notification")
    elif len(roles) == 1:
        handoff_map.append(f"{roles[0]} \u2192 Self: task completion checkpoint")
    
    return handoff_map


def generate_friction_points(where_stuck: str, urgency: str, tools: List[str], 
                             roles: List[str], workflow_name: str) -> List[str]:
    """Generate friction points based on intake data"""
    modifier = URGENCY_MODIFIERS.get(urgency, "affecting")
    stuck_truncated = where_stuck[:100] + ('...' if len(where_stuck) > 100 else '')
    tools_str = ', '.join(tools[:3]) + ('...' if len(tools) > 3 else '')
    roles_str = ' and '.join(roles[:2]) if len(roles) >= 2 else (roles[0] if roles else 'team members')
    
    return [
        f"Handoff gap: {stuck_truncated}",
        f"Tool fragmentation across {tools_str} is {modifier} workflow continuity",
        f"Unclear ownership between {roles_str} at critical decision points",
        f"Missing feedback loops causing delays in the {workflow_name} process",
        "Information silos preventing visibility into workflow status",
    ]


def generate_decision_rights(roles: List[str], urgency: str) -> List[str]:
    """Generate decision rights clarifier"""
    first_role = roles[0] if roles else 'Team lead'
    second_role = roles[1] if len(roles) > 1 else 'approver'
    last_role = roles[-1] if roles else 'Manager'
    
    return [
        f"Priority conflicts: {first_role} should have final say on sequencing",
        f"Approval gating: Define SLA for {second_role} response time (suggest 24h max)",
        f"Exception handling: Escalation path should bypass normal flow when urgency is {urgency}",
        f"Resource allocation: {last_role} owns capacity decisions",
        "Scope changes: Require written approval before modifying workflow mid-stream",
    ]


def generate_7day_experiment(roles: List[str]) -> List[str]:
    """Generate next 7-day experiment plan"""
    first_role = roles[0] if roles else 'designated person'
    second_role = roles[1] if len(roles) > 1 else 'next step'
    last_role = roles[-1] if roles else 'owner'
    
    return [
        f"Day 1-2: Assign single owner ({first_role}) to track one complete workflow cycle end-to-end",
        f"Day 3-5: Create a one-page checklist for the {first_role} \u2192 {second_role} handoff with 3 required items",
        f"Day 6-7: Implement one decision rule: 'If no response in 4 hours, {last_role} decides and documents'",
    ]
