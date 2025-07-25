# Digital Human Backend

Node.js backend for the digital human agent system with advanced AI capabilities.

## Features

- **User Authentication**: JWT-based authentication with user registration and login
- **Memory Management**: Persistent short-term and long-term memory with AI summarization
- **Multi-Agent Reasoning**: Expert consultation system with reflection mechanisms
- **Alibaba Cloud Bailian Integration**: AI chat, ASR, TTS, and embedding capabilities
- **MCP Server Integration**: Support for multiple MCP servers for external information
- **Real-time Communication**: WebSocket support for live interactions
- **Emotion Detection**: AI-powered emotion analysis for character control

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start MongoDB (required):
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or install MongoDB locally
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `DASHSCOPE_API_KEY`: Alibaba Cloud Bailian API key
- `DASHSCOPE_API_URL`: Bailian API endpoint
- `PORT`: Server port (default: 8880)
- `FRONTEND_URL`: Frontend URL for CORS

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Chat
- `POST /api/chat/message` - Send message to AI agent
- `GET /api/chat/memories` - Get user memories

### WebSocket Events
- `send_message` - Send text message
- `send_audio` - Send audio for ASR
- `join_conversation` - Join conversation room
- `message_response` - Receive AI response
- `audio_response` - Receive TTS audio

## Architecture

- **Models**: User and Memory schemas with MongoDB
- **Services**: 
  - BailianService: Alibaba Cloud AI integration
  - MemoryService: Memory management and persistence
  - MultiAgentService: Multi-expert reasoning system
  - MCPService: MCP server integration
  - WebSocketService: Real-time communication
- **Routes**: REST API endpoints
- **Middleware**: Authentication and error handling
