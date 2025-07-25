# Deployment Guide

This guide covers deploying the complete digital human agent system with Node.js backend and Next.js frontend.

## Prerequisites

- Node.js 18+ 
- MongoDB 5.0+
- Alibaba Cloud Bailian API access
- Domain name (for production)

## Backend Deployment

### 1. Environment Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/digital-human
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DASHSCOPE_API_KEY=sk-c7f36e6ce4ce4709962d1804ca0569c8
DASHSCOPE_API_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
PORT=8880
FRONTEND_URL=http://localhost:3000
```

### 2. Database Setup

Start MongoDB:
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use MongoDB Atlas for production
```

### 3. Start Backend

```bash
# Development
npm run dev

# Production
npm start
```

## Frontend Deployment

### 1. Environment Setup

```bash
cd web
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8880/api
```

### 2. Build and Start

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Production Deployment

### Using Docker

1. Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: digital-human

  backend:
    build: ./backend
    ports:
      - "8880:8880"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/digital-human
      - JWT_SECRET=your-production-jwt-secret
      - DASHSCOPE_API_KEY=sk-c7f36e6ce4ce4709962d1804ca0569c8
      - DASHSCOPE_API_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
      - FRONTEND_URL=http://localhost:3000
    depends_on:
      - mongodb

  frontend:
    build: ./web
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8880/api
    depends_on:
      - backend

volumes:
  mongodb_data:
```

2. Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8880
CMD ["npm", "start"]
```

3. Create `web/Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

4. Deploy:

```bash
docker-compose up -d
```

### Using Cloud Services

#### Backend (Railway/Heroku/DigitalOcean)

1. Set environment variables in your cloud platform
2. Connect MongoDB Atlas or cloud MongoDB
3. Deploy from Git repository

#### Frontend (Vercel/Netlify)

1. Connect your Git repository
2. Set build command: `npm run build`
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL=https://your-backend-url.com/api`

## Testing Deployment

1. **Health Check**: Visit `http://your-backend-url/health`
2. **Frontend**: Visit your frontend URL
3. **Authentication**: Test user registration and login
4. **Chat**: Test AI conversation functionality
5. **Voice**: Test ASR/TTS features
6. **Memory**: Verify conversation persistence
7. **MCP**: Test external information queries

## Monitoring

- Monitor backend logs for errors
- Check MongoDB connection and performance
- Monitor API response times
- Track WebSocket connections
- Monitor Alibaba Cloud API usage

## Security Considerations

- Use strong JWT secrets
- Enable HTTPS in production
- Secure MongoDB with authentication
- Rate limit API endpoints
- Validate all user inputs
- Keep API keys secure and rotate regularly

## Troubleshooting

### Common Issues

1. **MongoDB Connection**: Check connection string and network access
2. **API Key Issues**: Verify Alibaba Cloud credentials
3. **CORS Errors**: Check FRONTEND_URL configuration
4. **WebSocket Issues**: Ensure proper proxy configuration
5. **Memory Issues**: Monitor memory usage and implement cleanup

### Logs

Check application logs:
```bash
# Backend logs
npm run dev

# Frontend logs  
npm run dev

# Docker logs
docker-compose logs -f
```
