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

# Fields to search for evidence, in priority order
EVIDENCE_FIELDS = [
    "whereItGetsStuck",
    "workflowDescription",
    "toolsUsed",
    "desiredOutcome"
]

MAX_SNIPPET_LENGTH = 140
MAX_EVIDENCE_SNIPPETS = 3


def get_tag_label(tag: str) -> str:
    """Get human-readable label for a tag."""
    return TAG_LABELS.get(tag, tag.replace("_", " ").title())


def find_keyword_in_text(text: str, keyword: str) -> Tuple[bool, int, int]:
    """
    Find keyword in text and return match info.
    Returns: (found, start_index, end_index)
    """
    text_lower = text.lower()
    keyword_lower = keyword.lower()
    idx = text_lower.find(keyword_lower)
    if idx >= 0:
        return True, idx, idx + len(keyword)
    return False, -1, -1


def extract_snippet(text: str, keyword: str, max_length: int = MAX_SNIPPET_LENGTH) -> str:
    """
    Extract a snippet from text centered around a keyword.
    Returns the exact substring from the original text.
    """
    found, start, end = find_keyword_in_text(text, keyword)
    if not found:
        return ""
    
    # Calculate context window
    context_before = (max_length - (end - start)) // 2
    context_after = max_length - (end - start) - context_before
    
    snippet_start = max(0, start - context_before)
    snippet_end = min(len(text), end + context_after)
    
    # Adjust to not cut words
    if snippet_start > 0:
        # Find next space after start
        space_idx = text.find(' ', snippet_start)
        if space_idx != -1 and space_idx < start:
            snippet_start = space_idx + 1
    
    if snippet_end < len(text):
        # Find last space before end
        space_idx = text.rfind(' ', start, snippet_end)
        if space_idx != -1:
            snippet_end = space_idx
    
    snippet = text[snippet_start:snippet_end].strip()
    
    # Add ellipsis if truncated
    if snippet_start > 0:
        snippet = "..." + snippet
    if snippet_end < len(text):
        snippet = snippet + "..."
    
    return snippet[:max_length + 6]  # Account for ellipsis


def score_text_for_tag(text: str, tag: str) -> Tuple[int, List[str]]:
    """
    Score a text block for a specific tag based on keyword matches.
    
    Args:
        text: The text to analyze
        tag: The tag to score for
        
    Returns:
        Tuple of (score, list of matched keywords)
    """
    text_lower = text.lower()
    triggers = TAG_TRIGGERS.get(tag, [])
    score = 0
    matched_keywords = []
    
    for trigger in triggers:
        if trigger.lower() in text_lower:
            score += 1
            matched_keywords.append(trigger)
            # Bonus point for word boundary match
            if re.search(r'\b' + re.escape(trigger.lower()) + r'\b', text_lower):
                score += 1
    
    return score, matched_keywords


def calculate_tag_scores(intake: Dict[str, Any], extraction: Dict[str, Any]) -> Tuple[Dict[str, int], Dict[str, Dict[str, List[str]]]]:
    """
    Calculate scores for all tags based on intake and extraction data.
    
    Returns:
        Tuple of (scores dict, keyword_matches dict)
        keyword_matches: {tag: {field: [matched_keywords]}}
    """
    scores: Dict[str, int] = {}
    keyword_matches: Dict[str, Dict[str, List[str]]] = {tag: {} for tag in TAG_TRIGGERS.keys()}
    
    # Score each field separately for evidence tracking
    for field in EVIDENCE_FIELDS:
        field_text = intake.get(field, "")
        if not field_text:
            continue
            
        for tag in TAG_TRIGGERS.keys():
            field_score, matched = score_text_for_tag(field_text, tag)
            if matched:
                keyword_matches[tag][field] = matched
                scores[tag] = scores.get(tag, 0) + field_score
    
    # Also check rolesInvolved
    roles_text = intake.get("rolesInvolved", "")
    for tag in TAG_TRIGGERS.keys():
        field_score, matched = score_text_for_tag(roles_text, tag)
        if matched:
            keyword_matches[tag]["rolesInvolved"] = matched
            scores[tag] = scores.get(tag, 0) + field_score
    
    # Boost scores based on extraction patterns
    roles = extraction.get("roles", [])
    systems = extraction.get("systems", [])
    
    if len(roles) > 4:
        scores["ownership_ambiguity"] = scores.get("ownership_ambiguity", 0) + 2
    
    if len(systems) > 3:
        scores["duplicate_tracking"] = scores.get("duplicate_tracking", 0) + 1
        scores["context_switching_overload"] = scores.get("context_switching_overload", 0) + 1
    
    systems_lower = " ".join(systems).lower()
    if "slack" in systems_lower or "teams" in systems_lower or "email" in systems_lower:
        scores["context_switching_overload"] = scores.get("context_switching_overload", 0) + 1
    
    if "spreadsheet" in systems_lower or "excel" in systems_lower or "sheets" in systems_lower:
        scores["duplicate_tracking"] = scores.get("duplicate_tracking", 0) + 1
    
    if extraction.get("wait_states"):
        scores["queue_opacity"] = scores.get("queue_opacity", 0) + 2
    
    if len(extraction.get("decision_points", [])) > 1:
        scores["decision_rights_unclear"] = scores.get("decision_rights_unclear", 0) + 1
    
    return scores, keyword_matches


def select_tags(scores: Dict[str, int]) -> Tuple[str, List[str]]:
    """
    Select primary and secondary tags based on scores.
    """
    if not scores or all(s == 0 for s in scores.values()):
        return "ownership_ambiguity", []
    
    sorted_tags = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    
    primary_tag = sorted_tags[0][0]
    primary_score = sorted_tags[0][1]
    
    secondary_tags = []
    for tag, score in sorted_tags[1:]:
        if score >= primary_score - 1 and score > 0:
            secondary_tags.append(tag)
        if len(secondary_tags) >= 2:
            break
    
    return primary_tag, secondary_tags


def calculate_confidence(scores: Dict[str, int], primary_tag: str) -> float:
    """
    Calculate confidence score for the diagnosis.
    
    Confidence = primaryTagScore / totalScore
    Clamped between 0.4 and 0.95
    """
    total_score = sum(scores.values())
    if total_score == 0:
        return 0.4
    
    primary_score = scores.get(primary_tag, 0)
    raw_confidence = primary_score / total_score
    
    # Clamp between 0.4 and 0.95
    clamped = max(0.4, min(0.95, raw_confidence))
    
    return round(clamped, 2)


def extract_evidence(
    intake: Dict[str, Any],
    primary_tag: str,
    keyword_matches: Dict[str, Dict[str, List[str]]]
) -> List[Dict[str, str]]:
    """
    Extract evidence snippets for the primary tag.
    
    Returns up to 3 snippets from intake fields.
    Prefers whereItGetsStuck > workflowDescription > toolsUsed > desiredOutcome
    """
    evidence = []
    tag_matches = keyword_matches.get(primary_tag, {})
    
    # Process fields in priority order
    for field in EVIDENCE_FIELDS:
        if len(evidence) >= MAX_EVIDENCE_SNIPPETS:
            break
            
        keywords = tag_matches.get(field, [])
        field_text = intake.get(field, "")
        
        if not keywords or not field_text:
            continue
        
        # Get snippet for first unused keyword in this field
        used_snippets = set()
        for keyword in keywords:
            if len(evidence) >= MAX_EVIDENCE_SNIPPETS:
                break
                
            snippet = extract_snippet(field_text, keyword)
            if snippet and snippet not in used_snippets:
                evidence.append({
                    "field": field,
                    "snippet": snippet,
                    "tag": primary_tag
                })
                used_snippets.add(snippet)
    
    return evidence


def diagnose(intake: Dict[str, Any], extraction: Dict[str, Any]) -> Dict[str, Any]:
    """
    Perform diagnostic analysis on intake and extraction data.
    
    Returns:
        Diagnosis result with primaryTag, secondaryTags, confidence, and evidence
    """
    # Calculate scores and track keyword matches
    scores, keyword_matches = calculate_tag_scores(intake, extraction)
    
    # Select primary and secondary tags
    primary_tag, secondary_tags = select_tags(scores)
    
    # Calculate confidence
    confidence = calculate_confidence(scores, primary_tag)
    
    # Extract evidence snippets
    evidence = extract_evidence(intake, primary_tag, keyword_matches)
    
    return {
        "primaryTag": primary_tag,
        "secondaryTags": secondary_tags,
        "confidence": confidence,
        "evidence": evidence
    }
