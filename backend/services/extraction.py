"""Structured extraction service for workflow intake data"""
import re
from typing import Dict, List, Any


# Generic artifact keywords to detect
ARTIFACT_KEYWORDS = [
    "form", "ticket", "email", "spreadsheet", "invoice",
    "report", "document", "approval", "message", "order",
    "request", "contract", "schedule", "checklist", "manifest"
]


def parse_list_field(text: str) -> List[str]:
    """Parse a comma or newline separated string into a list of trimmed strings."""
    if not text:
        return []
    # Split by comma, newline, or semicolon
    items = re.split(r'[,\n;]+', text)
    return [item.strip() for item in items if item.strip()]


def detect_artifacts(text: str) -> List[str]:
    """Detect artifact keywords in text."""
    text_lower = text.lower()
    found = []
    for keyword in ARTIFACT_KEYWORDS:
        if keyword in text_lower:
            found.append(keyword)
    # If none found, return a default
    if not found:
        found = ["document"]
    return found


def extract_structure(intake: Dict[str, Any]) -> Dict[str, Any]:
    """
    Extract a universal structured representation from intake data.
    
    Args:
        intake: Dictionary containing intake form fields
        
    Returns:
        Structured extraction dictionary with domain-agnostic schema
    """
    # Parse roles and systems
    roles = parse_list_field(intake.get("rolesInvolved", ""))
    systems = parse_list_field(intake.get("toolsUsed", ""))
    
    # Detect artifacts from workflow description and where it gets stuck
    combined_text = f"{intake.get('workflowDescription', '')} {intake.get('whereItGetsStuck', '')}"
    artifacts = detect_artifacts(combined_text)
    
    # Generate steps from roles (simple sequential workflow)
    steps = []
    for i, role in enumerate(roles):
        step_id = f"S{i + 1}"
        next_steps = [f"S{i + 2}"] if i < len(roles) - 1 else []
        
        # Determine inputs/outputs based on position
        inputs = [artifacts[0]] if artifacts and i == 0 else ["previous_output"]
        outputs = ["processed_" + artifacts[0]] if artifacts else ["output"]
        
        steps.append({
            "id": step_id,
            "actor": role,
            "action": f"Process and hand off",
            "inputs": inputs,
            "outputs": outputs,
            "next": next_steps
        })
    
    # Generate handoffs as a chain of role transitions
    handoffs = []
    default_channel = systems[0] if systems else "message"
    for i in range(len(roles) - 1):
        handoffs.append({
            "from": roles[i],
            "to": roles[i + 1],
            "artifact": "status update",
            "channel": default_channel
        })
    
    # Add completion handoff back to first role if multiple roles
    if len(roles) > 1:
        handoffs.append({
            "from": roles[-1],
            "to": roles[0],
            "artifact": "completion notification",
            "channel": default_channel
        })
    
    # Create default decision points
    decision_points = [
        {
            "when": "When priorities conflict",
            "owner": roles[0] if roles else "Unassigned",
            "options": ["Escalate", "Defer", "Decide and document"]
        },
        {
            "when": "When an exception occurs",
            "owner": roles[-1] if roles else "Unassigned",
            "options": ["Escalate", "Defer", "Decide and document"]
        }
    ]
    
    # Create wait state from whereItGetsStuck
    where_stuck = intake.get("whereItGetsStuck", "Unknown friction point")
    wait_states = [
        {
            "where": "Handoff transition",
            "cause": where_stuck[:200] if len(where_stuck) > 200 else where_stuck,
            "owner": roles[0] if roles else "Unassigned"
        }
    ]
    
    # Create exception from whereItGetsStuck and desiredOutcome
    desired_outcome = intake.get("desiredOutcome", "Smooth workflow")
    exceptions = [
        {
            "trigger": where_stuck[:100] if len(where_stuck) > 100 else where_stuck,
            "current_behavior": "Process stalls or requires manual intervention",
            "desired_behavior": desired_outcome[:150] if len(desired_outcome) > 150 else desired_outcome
        }
    ]
    
    return {
        "domain": intake.get("domain", "general"),
        "roles": roles,
        "systems": systems,
        "artifacts": artifacts,
        "steps": steps,
        "handoffs": handoffs,
        "decision_points": decision_points,
        "wait_states": wait_states,
        "exceptions": exceptions
    }
