# Handoff Diagnostic

> **Identify friction points in your workflows and get actionable recommendations—no consultants required.**

![CI](https://github.com/WBZK/handoff-diagnostic/actions/workflows/ci.yml/badge.svg)
![Build](https://github.com/WBZK/handoff-diagnostic/actions/workflows/android-aab.yml/badge.svg)

**Status:** Active • **Support:** [Issues](https://github.com/WBZK/handoff-diagnostic/issues) & [Discussions](https://github.com/WBZK/handoff-diagnostic/discussions) • **License:** MIT  
**Maintained by:** WBZK LLC • **Last release:** 0.3.0 (2026-02-24)

---

📚 **Docs:** [Changelog](CHANGES.md) • [Privacy/Usage FAQ](PRIVACY_USAGE_FAQ.md) • [Security](SECURITY.md) • [Deployment](DEPLOYMENT.md)

---

## What it does

A minimal app that generates structured workflow diagnostic reports from a single "stuck workflow" intake.

- **Collects workflow intake**: company, workflow name, description, roles, tools, where it gets stuck, desired outcome, urgency, domain
- **Generates comprehensive reports** with:
  - Summary
  - Handoff Map
  - Friction Points
  - Decision Rights Clarifier
  - Stop-Doing List
  - Next 7-Day Experiment
  - Diagnosis with confidence scoring
  - Evidence extraction
- **Saves reports** and lets users view them later

## Features

| Feature | Description |
|---------|-------------|
| 🎯 **7 Diagnostic Tags** | ownership_ambiguity, decision_rights_unclear, queue_opacity, artifact_mismatch, exception_handling_undefined, duplicate_tracking, context_switching_overload |
| 📊 **Confidence Scoring** | 40-95% confidence with color-coded badges |
| 📝 **Evidence Extraction** | Up to 3 evidence snippets per diagnosis |
| 🏭 **Domain Playbooks** | SaaS, Finance, Healthcare, Logistics, General |
| ❓ **"Why this diagnosis?"** | Expandable explanation panel |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React Native + Expo |
| Backend | FastAPI (Python) |
| Database | MongoDB |
| CI/CD | GitHub Actions |
| Report Generation | Deterministic template-based logic (no external LLM required) |

## Quick Start

```bash
# Clone
git clone https://github.com/WBZK/handoff-diagnostic.git
cd handoff-diagnostic

# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001

# Frontend (new terminal)
cd frontend
yarn install
yarn start
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment.

## Usage

1. From the Home screen, tap **"New Workflow Intake"**
2. Fill in your workflow details and select a domain
3. Tap **"Generate Report"**
4. Review your diagnostic report with:
   - Domain & diagnosis badges
   - Confidence level
   - Evidence snippets
   - "Why this diagnosis?" explanation
5. Save the report for later reference

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/intake` | Generate diagnostic report |
| POST | `/api/reports/save` | Save a report |
| GET | `/api/reports` | List saved reports |
| GET | `/api/reports/:id` | Get specific report |

## Testing

> 🔴 **Demo Failure:** See `frontend/__tests__/example.failing.test.ts`. We use it in walkthroughs to show red/green CI hygiene.

```bash
cd frontend
yarn test
```

## Roadmap

- [x] MVP with intake form and report generation
- [x] Domain-specific playbooks
- [x] Confidence scoring & evidence extraction
- [x] "Why this diagnosis?" explanations
- [x] Android AAB build pipeline
- [ ] PDF export
- [ ] iOS build
- [ ] Analytics dashboard (opt-in)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT © WBZK LLC

---

**Need help?** Open an [Issue](https://github.com/WBZK/handoff-diagnostic/issues) or email Kackuber@gmail.com
