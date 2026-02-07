# Changelog
All notable changes to this project will be documented in this file.

Dates use YYYY-MM-DD.

## [Unreleased]
### Added
- Domain field (required): general, logistics, healthcare, finance, saas, manufacturing, public, other
- Structured extraction service (`/backend/services/extraction.py`) with universal schema
- Playbook system with domain-specific filtering (`/backend/playbooks/`)
- Five playbooks:
  - general_ownership_ambiguity (all domains)
  - logistics_accessorials_and_proof (logistics only)
  - healthcare_charting_and_handoffs (healthcare only)
  - saas_workflow_handoff_and_context (saas only)
  - finance_approvals_and_artifacts (finance only)
- Enhanced diagnosis service (`/backend/services/diagnosis.py`) with 7 diagnostic tags:
  - ownership_ambiguity
  - decision_rights_unclear
  - queue_opacity
  - artifact_mismatch
  - exception_handling_undefined
  - duplicate_tracking
  - context_switching_overload
- Keyword-based scoring system for deterministic tag selection
- Secondary tags for reports with multiple issues (within 1 point of primary)
- Domain picker UI in intake form with modal selection
- Domain and diagnosis badges displayed on report screens
- Test fixtures for all domain types (logistics, healthcare, saas, finance)

### Changed
- Intake endpoint now returns `intake`, `extraction`, and `diagnosis` objects
- Report generation enhanced with playbook templates filtered by domain
- SaveReportInput model updated to include extraction and diagnosis
- Diagnosis tags now dynamically selected based on intake content analysis

### Fixed
- Playbook enhancement now correctly merges with base report content
- Domain-specific playbooks prioritized over general playbooks

### Removed
-


## [0.1.0] - 2026-02-02
### Added
- Initial MVP: React Native (Expo) client + backend API for intake, report generation, and report storage.
- Core screens: Home, Intake, Report, Reports List, Report Detail.
- Deterministic report generation (no external LLM).
- Save and retrieve reports via backend.
