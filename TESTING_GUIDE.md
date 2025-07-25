# Testing Guide for Digital Human Agent System

## Prerequisites

1. **MongoDB**: Ensure MongoDB is running on localhost:27017
2. **Node.js**: Version 18+ required
3. **Environment Variables**: Set up .env files as described in DEPLOYMENT.md

## Backend Testing

### 1. Start Backend Server

```bash
cd backend
npm install
npm run dev
```

Expected output:
```
Connected to MongoDB
MCP clients initialized
Server running on port 8880
```

### 2. Test Health Endpoint

```bash
curl http://localhost:8880/health
```

Expected response:
```json
{"status":"OK","timestamp":"2025-01-25T08:50:36.000Z"}
```

### 3. Test User Registration

```bash
curl -X POST http://localhost:8880/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "testuser",
    "email": "test@example.com",
    "profile": {}
  }
}
```

### 4. Test User Login

```bash
curl -X POST http://localhost:8880/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 5. Test Chat Message

```bash
curl -X POST http://localhost:8880/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "Hello, how are you?",
    "conversationId": "test_conv_123"
  }'
```

## Frontend Testing

### 1. Start Frontend Server

```bash
cd web
npm install
npm run dev
```

Expected output:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### 2. Test Authentication Flow

1. Open http://localhost:3000
2. Authentication modal should appear
3. Test registration with new user
4. Test login with existing user
5. Verify authentication state persists on page refresh

### 3. Test Chat Interface

1. After authentication, chat interface should be available
2. Send a test message: "Hello, tell me a joke"
3. Verify AI response appears
4. Check that character expressions change based on emotion
5. Verify conversation history persists

### 4. Test Voice Features (if available)

1. Click microphone button
2. Speak a message
3. Verify speech-to-text conversion
4. Verify AI response with text-to-speech

## WebSocket Testing

### 1. Test WebSocket Connection

Open browser developer tools and check console for:
```
Connected to server
```

### 2. Test Real-time Messaging

1. Send message through chat interface
2. Verify WebSocket events in network tab
3. Check for `message_response` and `audio_response` events

## Memory System Testing

### 1. Test Short-term Memory

1. Have a conversation with multiple messages
2. Reference earlier parts of the conversation
3. Verify AI remembers context

### 2. Test Memory Persistence

1. Log out and log back in
2. Continue conversation
3. Verify AI remembers previous conversations

### 3. Test Memory Search

```bash
curl -X GET "http://localhost:8880/api/chat/memories?query=joke" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## MCP Server Testing

### 1. Test Time Server

Send message: "What time is it?"
Expected: AI should use time MCP server for current time

### 2. Test Search Server

Send message: "Search for latest news about AI"
Expected: AI should use web search MCP server

### 3. Test Train Server

Send message: "Check train schedules from Beijing to Shanghai"
Expected: AI should use 12306 MCP server

## Live2D Character Testing

### 1. Test Emotion Changes

1. Send happy message: "I'm so excited!"
2. Verify character shows happy expression
3. Send sad message: "I'm feeling down"
4. Verify character shows sad expression

### 2. Test Motion Control

1. Send various emotional messages
2. Verify character motions match emotions
3. Check motion intensity based on message content

## Error Testing

### 1. Test Invalid Authentication

```bash
curl -X POST http://localhost:8880/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer invalid_token" \
  -d '{"message": "test", "conversationId": "test"}'
```

Expected: 401 Unauthorized

### 2. Test Database Connection Issues

1. Stop MongoDB
2. Try to register new user
3. Verify appropriate error handling

### 3. Test API Rate Limiting

1. Send multiple rapid requests
2. Verify rate limiting works (if implemented)

## Performance Testing

### 1. Test Memory Usage

1. Have long conversations (100+ messages)
2. Monitor memory usage
3. Verify memory cleanup works

### 2. Test Concurrent Users

1. Open multiple browser tabs
2. Login with different users
3. Verify conversations are isolated

## Deployment Testing

### 1. Test Docker Deployment

```bash
docker-compose up -d
```

Verify all services start correctly:
- MongoDB container
- Backend container
- Frontend container

### 2. Test Production Build

```bash
cd web
npm run build
npm start
```

Verify production build works correctly.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MongoDB is running: `docker ps` or `systemctl status mongod`
   - Verify connection string in .env

2. **WebSocket Connection Failed**
   - Check CORS settings
   - Verify frontend URL in backend .env

3. **Authentication Not Working**
   - Check JWT_SECRET is set
   - Verify token format

4. **AI Responses Not Working**
   - Check DASHSCOPE_API_KEY is valid
   - Verify API endpoint accessibility

5. **Character Not Responding to Emotions**
   - Check Live2D model supports expressions
   - Verify emotion mapping in code

### Debug Commands

```bash
# Check backend logs
cd backend && npm run dev

# Check frontend logs
cd web && npm run dev

# Check MongoDB logs
docker logs mongodb

# Check all containers
docker-compose logs -f
```

## Success Criteria

✅ All API endpoints respond correctly
✅ User authentication works end-to-end
✅ Memory persistence across sessions
✅ AI conversations with multi-agent reasoning
✅ WebSocket real-time communication
✅ Character emotion control
✅ MCP server integrations
✅ Voice interactions (ASR/TTS)
✅ Cross-user data isolation
✅ Docker deployment works
✅ No memory leaks or performance issues

This testing guide ensures all components of the digital human agent system work correctly before deployment.
