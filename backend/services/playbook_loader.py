"""Playbook loading and filtering service"""
import json
import os
from typing import List, Dict, Any
from pathlib import Path


PLAYBOOKS_DIR = Path(__file__).parent.parent / "playbooks"


def load_all_playbooks() -> List[Dict[str, Any]]:
    """Load all playbook JSON files from the playbooks directory."""
    playbooks = []
    
    if not PLAYBOOKS_DIR.exists():
        return playbooks
    
    for filename in os.listdir(PLAYBOOKS_DIR):
        if filename.endswith(".json"):
            filepath = PLAYBOOKS_DIR / filename
            try:
                with open(filepath, "r") as f:
                    playbook = json.load(f)
                    playbooks.append(playbook)
            except (json.JSONDecodeError, IOError) as e:
                print(f"Error loading playbook {filename}: {e}")
    
    return playbooks


def filter_playbooks_by_domain(playbooks: List[Dict[str, Any]], domain: str) -> List[Dict[str, Any]]:
    """
    Filter playbooks to only those allowed for the given domain.
    
    Args:
        playbooks: List of playbook dictionaries
        domain: The domain to filter by
        
    Returns:
        List of playbooks that are allowed for the domain
    """
    # If domain is "general", only return general playbooks
    if domain == "general":
        return [
            p for p in playbooks 
            if p.get("id", "").startswith("general_") or 
               "general" in p.get("domains_allowed", []) and 
               len(p.get("domains_allowed", [])) == len(get_all_domains())
        ]
    
    # Otherwise, return playbooks where domain is in domains_allowed
    return [
        p for p in playbooks 
        if domain in p.get("domains_allowed", [])
    ]


def get_all_domains() -> List[str]:
    """Return all allowed domain values."""
    return ["general", "logistics", "healthcare", "finance", "saas", "manufacturing", "public", "other"]


def get_playbook_templates(playbooks: List[Dict[str, Any]], template_key: str) -> List[str]:
    """
    Extract all templates of a specific type from a list of playbooks.
    
    Args:
        playbooks: List of playbook dictionaries
        template_key: Key name for the template list (e.g., 'friction_templates')
        
    Returns:
        Combined list of templates from all playbooks
    """
    templates = []
    for playbook in playbooks:
        templates.extend(playbook.get(template_key, []))
    return templates
