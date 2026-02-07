"""Diagnosis service for analyzing workflow intake and determining issue tags."""
import re
from typing import Dict, List, Any, Tuple


# Tag definitions with trigger keywords/phrases
TAG_TRIGGERS: Dict[str, List[str]] = {
    "ownership_ambiguity": [
        "not sure who", "someone", "they", "no owner", "unclear",
        "nobody", "anyone", "whose job", "who owns", "accountability",
        "responsibility", "falls through", "dropped", "no one",
        "assumes", "supposed to", "should have"
    ],
    "decision_rights_unclear": [
        "approval", "sign off", "who decides", "escalate", "permission",
        "authorize", "authority", "final say", "sign-off", "approve",
        "veto", "override", "can't proceed", "waiting for approval",
        "need permission", "manager", "supervisor", "hierarchy"
    ],
    "queue_opacity": [
        "waiting", "follow up", "no response", "stuck", "pending",
        "status", "where is", "backlog", "queue", "delayed",
        "hold", "stalled", "blocked", "can't see", "visibility",
        "don't know where", "lost track", "no update"
    ],
    "artifact_mismatch": [
        "missing", "incorrect", "wrong form", "can't verify", "proof",
        "documentation", "document", "paperwork", "incomplete",
        "not filled", "wrong version", "outdated", "mismatch",
        "doesn't match", "discrepancy", "inaccurate", "data quality"
    ],
    "exception_handling_undefined": [
        "when x happens", "exception", "off plan", "special case",
        "no process", "edge case", "unusual", "unexpected",
        "what if", "not covered", "no rule", "ad hoc", "one-off",
        "workaround", "manual intervention", "escalation"
    ],
    "duplicate_tracking": [
        "spreadsheet and", "also track", "duplicate", "multiple",
        "same info", "two places", "both systems", "copy",
        "re-enter", "double entry", "redundant", "parallel",
        "sync", "out of sync", "different systems", "manual update"
    ],
    "context_switching_overload": [
        "interrupt", "ping", "slack", "email", "call", "constantly",
        "fire drill", "distraction", "urgent", "asap", "drop everything",
        "context switch", "multitask", "too many", "overwhelm",
        "notification", "alert", "message", "chat"
    ]
}

# Human-readable labels for tags
TAG_LABELS: Dict[str, str] = {
    "ownership_ambiguity": "Ownership Ambiguity",
    "decision_rights_unclear": "Decision Rights Unclear",
    "queue_opacity": "Queue Opacity",
    "artifact_mismatch": "Artifact Mismatch",
    "exception_handling_undefined": "Exception Handling Undefined",
    "duplicate_tracking": "Duplicate Tracking",
    "context_switching_overload": "Context Switching Overload"
}


def get_tag_label(tag: str) -> str:
    """Get human-readable label for a tag."""
    return TAG_LABELS.get(tag, tag.replace("_", " ").title())


def score_text_for_tag(text: str, tag: str) -> int:
    """
    Score a text block for a specific tag based on keyword matches.
    
    Args:
        text: The text to analyze
        tag: The tag to score for
        
    Returns:
        Score (count of keyword matches)
    """
    text_lower = text.lower()
    triggers = TAG_TRIGGERS.get(tag, [])
    score = 0
    
    for trigger in triggers:
        # Count occurrences of each trigger phrase
        if trigger.lower() in text_lower:
            score += 1
            # Bonus point for exact phrase match vs partial
            if re.search(r'\b' + re.escape(trigger.lower()) + r'\b', text_lower):
                score += 1
    
    return score


def calculate_tag_scores(intake: Dict[str, Any], extraction: Dict[str, Any]) -> Dict[str, int]:
    """
    Calculate scores for all tags based on intake and extraction data.
    
    Args:
        intake: The intake form data
        extraction: The extracted structure data
        
    Returns:
        Dictionary of tag -> score
    """
    # Combine relevant text fields for analysis
    text_fields = [
        intake.get("workflowDescription", ""),
        intake.get("whereItGetsStuck", ""),
        intake.get("toolsUsed", ""),
        intake.get("rolesInvolved", ""),
        intake.get("desiredOutcome", ""),
    ]
    combined_text = " ".join(text_fields)
    
    # Score each tag
    scores: Dict[str, int] = {}
    for tag in TAG_TRIGGERS.keys():
        scores[tag] = score_text_for_tag(combined_text, tag)
    
    # Boost scores based on extraction patterns
    roles = extraction.get("roles", [])
    systems = extraction.get("systems", [])
    
    # Many roles suggests ownership complexity
    if len(roles) > 4:
        scores["ownership_ambiguity"] += 2
    
    # Many systems suggests duplicate tracking or context switching
    if len(systems) > 3:
        scores["duplicate_tracking"] += 1
        scores["context_switching_overload"] += 1
    
    # Check for specific system types
    systems_lower = " ".join(systems).lower()
    if "slack" in systems_lower or "teams" in systems_lower or "email" in systems_lower:
        scores["context_switching_overload"] += 1
    
    if "spreadsheet" in systems_lower or "excel" in systems_lower or "sheets" in systems_lower:
        scores["duplicate_tracking"] += 1
    
    # Wait states indicate queue opacity
    if extraction.get("wait_states"):
        scores["queue_opacity"] += 2
    
    # Decision points indicate potential decision rights issues
    if len(extraction.get("decision_points", [])) > 1:
        scores["decision_rights_unclear"] += 1
    
    return scores


def select_tags(scores: Dict[str, int]) -> Tuple[str, List[str]]:
    """
    Select primary and secondary tags based on scores.
    
    Args:
        scores: Dictionary of tag -> score
        
    Returns:
        Tuple of (primary_tag, secondary_tags)
    """
    if not scores or all(s == 0 for s in scores.values()):
        # Default fallback if no keywords matched
        return "ownership_ambiguity", []
    
    # Sort tags by score descending
    sorted_tags = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    
    # Primary is highest score
    primary_tag = sorted_tags[0][0]
    primary_score = sorted_tags[0][1]
    
    # Secondary tags are within 1 point of primary (max 2)
    secondary_tags = []
    for tag, score in sorted_tags[1:]:
        if score >= primary_score - 1 and score > 0:
            secondary_tags.append(tag)
        if len(secondary_tags) >= 2:
            break
    
    return primary_tag, secondary_tags


def diagnose(intake: Dict[str, Any], extraction: Dict[str, Any]) -> Dict[str, Any]:
    """
    Perform diagnostic analysis on intake and extraction data.
    
    Args:
        intake: The intake form data
        extraction: The extracted structure data
        
    Returns:
        Diagnosis result with primaryTag and secondaryTags
    """
    # Calculate scores for all tags
    scores = calculate_tag_scores(intake, extraction)
    
    # Select primary and secondary tags
    primary_tag, secondary_tags = select_tags(scores)
    
    return {
        "primaryTag": primary_tag,
        "secondaryTags": secondary_tags,
        "_scores": scores  # Include for debugging (optional, can remove in production)
    }
