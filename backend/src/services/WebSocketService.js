const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const MultiAgentService = require('./MultiAgentService');
const BailianService = require('./BailianService');

class WebSocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });
    
    this.multiAgentService = new MultiAgentService();
    this.bailianService = new BailianService();
    this.setupMiddleware();
    this.setupEventHandlers();
  }

  setupMiddleware() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
          return next(new Error('User not found'));
        }

        socket.userId = user._id.toString();
        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User ${socket.userId} connected`);

      socket.on('join_conversation', (conversationId) => {
        socket.join(conversationId);
        socket.conversationId = conversationId;
      });

      socket.on('send_message', async (data) => {
        try {
          const { message, conversationId } = data;
          
          const result = await this.multiAgentService.processWithMultipleExperts(
            socket.userId,
            message,
            conversationId
          );

          socket.emit('message_response', {
            response: result.response,
            emotion: result.emotion,
            conversationId
          });

          try {
            const audioBuffer = await this.bailianService.textToSpeech(result.response);
            socket.emit('audio_response', {
              audio: audioBuffer,
              conversationId
            });
          } catch (ttsError) {
            console.error('TTS error:', ttsError);
          }

        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      socket.on('send_audio', async (data) => {
        try {
          const { audioBuffer, conversationId } = data;
          
          const text = await this.bailianService.speechToText(audioBuffer);
          
          const result = await this.multiAgentService.processWithMultipleExperts(
            socket.userId,
            text,
            conversationId
          );

          socket.emit('message_response', {
            response: result.response,
            emotion: result.emotion,
            originalText: text,
            conversationId
          });

          try {
            const responseAudio = await this.bailianService.textToSpeech(result.response);
            socket.emit('audio_response', {
              audio: responseAudio,
              conversationId
            });
          } catch (ttsError) {
            console.error('TTS error:', ttsError);
          }

        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      socket.on('disconnect', () => {
        console.log(`User ${socket.userId} disconnected`);
      });
    });
  }
}

module.exports = WebSocketService;
