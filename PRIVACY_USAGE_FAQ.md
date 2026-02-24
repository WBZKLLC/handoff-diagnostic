# Privacy & Usage FAQ

## What data does the app process?
Only workflow diagnostic metadata (workflow names, descriptions, roles, tools used). No personally identifiable information (PII) is required to use the app.

## Where is data stored?
- **Local device**: Reports are stored on your device via the app
- **Backend**: MongoDB database for saved reports
- **No third-party sharing**: Your data is never shared with external services

## Can we self-host?
Yes. The application is fully self-hostable:
- Backend: FastAPI (Python)
- Database: MongoDB
- Frontend: React Native/Expo

See `DEPLOYMENT.md` for container + environment examples.

## How do we delete data?
- Use the app's report management features to delete individual reports
- For complete data removal, clear the MongoDB `reports` collection
- No data is retained after deletion

## Security posture?
- Least-privilege architecture
- Transport via HTTPS/TLS
- No hardcoded secrets (environment variables)
- CORS configured for security

## Compliance alignment?
Designed to be compatible with common compliance obligations (SOC2/ISO-27001) when deployed inside your controlled environment. This repository does not claim certification.

## Telemetry/analytics?
**Off by default.** No analytics or tracking frameworks are used. No data is sent to external services.

## Support & SLAs?
- **Community support**: GitHub Issues
- **Commercial support**: Available on request
- **Contact**: Kackuber@gmail.com

## What diagnostic tags are supported?
| Tag | Description |
|-----|-------------|
| ownership_ambiguity | Unclear responsibility for steps/decisions |
| decision_rights_unclear | No explicit authority for approvals |
| queue_opacity | Work waiting without visibility |
| artifact_mismatch | Missing or inconsistent documents |
| exception_handling_undefined | Ad-hoc handling of edge cases |
| duplicate_tracking | Same info tracked in multiple places |
| context_switching_overload | Work fragmented across channels |

---

**Related Documents:**
- [Privacy Policy](PRIVACY_POLICY.md)
- [Changelog](CHANGES.md)
- [Security](SECURITY.md)
