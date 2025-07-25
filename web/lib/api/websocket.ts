import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string) {
    if (!token) {
      throw new Error('No authentication token available');
    }

    const serverUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8880';
    
    this.socket = io(serverUrl, {
      auth: {
        token: token
      },
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('Connection error:', error);
      this.handleReconnect(token);
    });

    return this.socket;
  }

  private handleReconnect(token: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnection attempt ${this.reconnectAttempts}`);
        this.connect(token);
      }, 1000 * this.reconnectAttempts);
    }
  }

  sendMessage(message: string, conversationId: string) {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('send_message', {
      message,
      conversationId
    });
  }

  sendAudio(audioBuffer: ArrayBuffer, conversationId: string) {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('send_audio', {
      audioBuffer,
      conversationId
    });
  }

  joinConversation(conversationId: string) {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('join_conversation', conversationId);
  }

  onMessageResponse(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('message_response', callback);
  }

  onAudioResponse(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('audio_response', callback);
  }

  onError(callback: (error: any) => void) {
    if (!this.socket) return;
    this.socket.on('error', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const wsService = new WebSocketService();
