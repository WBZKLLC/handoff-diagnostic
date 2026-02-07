# Changelog
All notable changes to this project will be documented in this file.

Dates use YYYY-MM-DD.

## [Unreleased]
### Added
- Domain field (required): general, logistics, healthcare, finance, saas, manufacturing, public, other
- Structured extraction service (`/backend/services/extraction.py`) with universal schema
- Playbook system with domain-specific filtering (`/backend/playbooks/`)
- Three playbooks: general_ownership_ambiguity, logistics_accessorials_and_proof, healthcare_charting_and_handoffs
- Diagnosis tags (primaryTag, secondaryTags) in report response
- Domain picker UI in intake form with modal selection
- Domain and diagnosis badges displayed on report screens
- Test fixtures for logistics and healthcare domains

### Changed
- Intake endpoint now returns `intake`, `extraction`, and `diagnosis` objects
- Report generation enhanced with playbook templates filtered by domain
- SaveReportInput model updated to include extraction and diagnosis

### Fixed
-

### Removed
-


## [0.1.0] - 2026-02-02
### Added
- Initial MVP: React Native (Expo) client + backend API for intake, report generation, and report storage.
- Core screens: Home, Intake, Report, Reports List, Report Detail.
- Deterministic report generation (no external LLM).
- Save and retrieve reports via backend.
