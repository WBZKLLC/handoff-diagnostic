"""Services package"""
from .report_generator import generate_diagnostic_report
from .report_repository import ReportRepository
from .extraction import extract_structure
from .diagnosis import diagnose, get_tag_label, TAG_LABELS
from .playbook_loader import (
    load_all_playbooks,
    filter_playbooks_by_domain,
    get_playbook_templates,
    get_all_domains,
)

__all__ = [
    "generate_diagnostic_report",
    "ReportRepository",
    "extract_structure",
    "diagnose",
    "get_tag_label",
    "TAG_LABELS",
    "load_all_playbooks",
    "filter_playbooks_by_domain",
    "get_playbook_templates",
    "get_all_domains",
]
