# Changelog

All notable changes to this project will be documented in this file.

## [0.3.0] - 2026-02-24
### Added
- Privacy/Usage FAQ documentation
- CI badge + example failing test for red/green workflow demo
- README: deployment + support sections
- "Why this diagnosis?" explanation panel on Report screens
- Evidence and confidence scoring in diagnostic reports

### Fixed
- Navigation crash on Play Store build (GestureHandlerRootView wrapper)
- Duplicate @react-navigation/native versions causing context errors

### Changed
- Bumped versionCode to 3
- Aligned all navigation dependency versions

## [0.2.1] - 2026-02-10
### Fixed
- Crash on "View Saved Reports" screen
- Improved error messages for offline mode
- SafeAreaView imports for Expo Go compatibility

### Changed
- React version updated to 19.1.0

## [0.2.0] - 2026-02-01
### Added
- Domain-specific playbooks (SaaS, Finance, Healthcare, Logistics)
- Enhanced diagnosis engine with 7 diagnostic tags
- Confidence scoring (0.4-0.95 range)
- Evidence extraction with snippets

### Changed
- Restructured codebase into scalable architecture
- Backend services modularized

## [0.1.0] - 2026-01-15
### Added
- Initial MVP release
- Workflow intake form with domain selection
- Diagnostic report generation
- Report saving and retrieval (MongoDB)
- FastAPI backend with deterministic logic
- React Native/Expo frontend
