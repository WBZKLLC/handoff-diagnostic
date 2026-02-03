# Handoff Diagnostic

A minimal app that generates a structured workflow diagnostic report from a single "stuck workflow" intake.

## What it does
- Collects a workflow intake (company, workflow name, description, roles, tools, where it gets stuck, desired outcome, urgency).
- Generates a report with:
  - Summary
  - Handoff Map
  - Friction Points
  - Decision Rights Clarifier
  - Stop-Doing List
  - Next 7-Day Experiment
- Saves reports and lets users view them later.

## Tech stack
- Frontend: React Native + Expo
- Backend: FastAPI
- Storage: MongoDB
- Report generation: deterministic template-based logic (no external LLM required)

## How to run (local)
1) Start the backend service.
2) Start the Expo app.
3) From the Home screen, create a new intake and generate a report.
4) Save the report and confirm it appears in Saved Reports.

## Status
MVP complete. PDF export is planned as a later phase.
