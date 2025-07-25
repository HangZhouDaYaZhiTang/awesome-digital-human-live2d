require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const WebSocketService = require('./services/WebSocketService');
const MCPService = require('./services/MCPService');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const wsService = new WebSocketService(server);
const mcpService = new MCPService();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-human')
  .then(() => {
    console.log('Connected to MongoDB');
    
    return mcpService.initializeClients();
  })
  .then(() => {
    console.log('MCP clients initialized');
    
    const PORT = process.env.PORT || 8880;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Startup error:', error);
    process.exit(1);
  });

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await mcpService.closeConnections();
  await mongoose.connection.close();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
