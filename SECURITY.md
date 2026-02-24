# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.3.x   | :white_check_mark: |
| 0.2.x   | :white_check_mark: |
| < 0.2   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Email**: Kackuber@gmail.com
2. **Subject**: `[SECURITY] Handoff Diagnostic - Brief Description`
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fixes (optional)

## Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Fix/Mitigation**: Depends on severity (Critical: 72h, High: 14d, Medium: 30d)

## Security Best Practices

When deploying this application:

1. **Environment Variables**: Never commit secrets to version control
2. **HTTPS**: Always use TLS in production
3. **Database**: Secure MongoDB with authentication
4. **Updates**: Keep dependencies updated
5. **Access Control**: Limit API access as needed

## Known Security Considerations

- No authentication layer included (add your own for production)
- CORS is configured to allow all origins (restrict for production)
- MongoDB connection string should use authentication in production

## Disclosure Policy

We follow responsible disclosure. Security issues will be:
1. Patched in a timely manner
2. Documented in CHANGES.md (after fix is released)
3. Credited to the reporter (if desired)
