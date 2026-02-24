# Deployment Guide

## Quick Start (Docker)

```bash
# Clone the repository
git clone https://github.com/WBZK/handoff-diagnostic.git
cd handoff-diagnostic

# Start with Docker Compose
docker-compose up -d
```

## Environment Variables

### Backend (`backend/.env`)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=handoff_diagnostic
```

### Frontend (`frontend/.env`)
```env
EXPO_PUBLIC_BACKEND_URL=https://your-api-domain.com
```

## Manual Deployment

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001
```

### Frontend (Expo)

```bash
cd frontend
yarn install
eas build --platform android --profile production
```

### Database (MongoDB)

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use MongoDB Atlas for managed hosting
```

## Production Checklist

- [ ] Set strong MongoDB credentials
- [ ] Configure HTTPS/TLS
- [ ] Restrict CORS origins
- [ ] Set up monitoring/logging
- [ ] Configure backup strategy
- [ ] Review SECURITY.md

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Mobile    │────▶│   FastAPI   │────▶│   MongoDB   │
│   (Expo)    │     │   Backend   │     │   Database  │
└─────────────┘     └─────────────┘     └─────────────┘
     :3000              :8001              :27017
```

## Support

- **Issues**: GitHub Issues
- **Email**: Kackuber@gmail.com
