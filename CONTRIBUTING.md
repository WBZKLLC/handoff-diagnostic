# Contributing to Handoff Diagnostic

Thank you for your interest in contributing!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Make your changes
5. Run tests: `yarn test`
6. Commit: `git commit -m "Add your feature"`
7. Push: `git push origin feature/your-feature`
8. Open a Pull Request

## Development Setup

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --reload

# Frontend
cd frontend
yarn install
yarn start
```

## Code Style

- **Python**: Follow PEP 8, use ruff for linting
- **TypeScript/React**: Follow ESLint rules
- **Commits**: Use conventional commits format

## Pull Request Guidelines

- Keep PRs focused and small
- Include tests for new features
- Update documentation as needed
- Ensure CI passes

## Reporting Issues

- Use GitHub Issues
- Include steps to reproduce
- Include device/environment info
- Check existing issues first

## Questions?

Open a Discussion or email Kackuber@gmail.com
