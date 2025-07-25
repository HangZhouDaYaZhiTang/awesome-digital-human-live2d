export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  emotion?: string;
}

export interface WebSocketResponse {
  response: string;
  emotion: string;
  conversationId: string;
  originalText?: string;
}

export interface AudioResponse {
  audio: ArrayBuffer;
  conversationId: string;
}
