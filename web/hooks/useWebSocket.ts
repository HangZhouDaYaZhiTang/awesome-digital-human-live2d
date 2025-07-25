import { useEffect, useRef, useState } from 'react';
import { wsService } from '@/lib/api/websocket';
import { useAuthStore } from '@/lib/store/auth';
import { Live2dManager } from '@/lib/live2d/live2dManager';
import { useChatRecordStore } from '@/lib/store/sentio';
import type { WebSocketResponse, AudioResponse } from '@/lib/types/chat';

export function useWebSocket() {
  const { isAuthenticated, token } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (isAuthenticated && token && !socketRef.current) {
      try {
        socketRef.current = wsService.connect(token);
        setIsConnected(true);

        wsService.onMessageResponse((data: WebSocketResponse) => {
          console.log('Message response:', data);
          
          const { addChatRecord } = useChatRecordStore.getState();
          addChatRecord({
            id: `ai_${Date.now()}`,
            role: 'assistant',
            content: data.response,
            timestamp: new Date().toISOString(),
            emotion: data.emotion
          });
          
          if (data.emotion) {
            Live2dManager.getInstance().updateEmotionFromResponse(data.response, data.emotion);
          }
        });

        wsService.onAudioResponse((data: AudioResponse) => {
          console.log('Audio response received');
          if (data.audio) {
            Live2dManager.getInstance().pushAudioQueue(data.audio);
            Live2dManager.getInstance().playAudio();
          }
        });

        wsService.onError((error: any) => {
          console.error('WebSocket error:', error);
        });

      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        setIsConnected(false);
      }
    }

    return () => {
      if (socketRef.current) {
        wsService.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, [isAuthenticated, token]);

  const sendMessage = (message: string, conversationId: string) => {
    if (isConnected) {
      wsService.sendMessage(message, conversationId);
    }
  };

  const sendAudio = (audioBuffer: ArrayBuffer, conversationId: string) => {
    if (isConnected) {
      wsService.sendAudio(audioBuffer, conversationId);
    }
  };

  const joinConversation = (conversationId: string) => {
    if (isConnected) {
      wsService.joinConversation(conversationId);
    }
  };

  return {
    isConnected,
    sendMessage,
    sendAudio,
    joinConversation
  };
}
