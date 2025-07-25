'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Card, CardBody } from '@heroui/react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuthStore } from '@/lib/store/auth';
import { useChatRecordStore } from '@/lib/store/sentio';

export default function EnhancedChatBot() {
  const [message, setMessage] = useState('');
  const [conversationId] = useState(() => `conv_${Date.now()}`);
  const { isConnected, sendMessage, joinConversation } = useWebSocket();
  const { isAuthenticated } = useAuthStore();
  const { chatRecord, addChatRecord } = useChatRecordStore();

  useEffect(() => {
    if (isConnected && isAuthenticated) {
      joinConversation(conversationId);
    }
  }, [isConnected, isAuthenticated, conversationId, joinConversation]);

  const handleSendMessage = () => {
    if (!message.trim() || !isConnected) return;

    addChatRecord({
      id: `msg_${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });

    sendMessage(message, conversationId);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardBody>
          <p className="text-center text-gray-500">请先登录以开始对话</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Card>
        <CardBody>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {chatRecord.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="flex space-x-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息..."
          className="flex-1"
          disabled={!isConnected}
        />
        <Button
          onPress={handleSendMessage}
          color="primary"
          disabled={!message.trim() || !isConnected}
        >
          发送
        </Button>
      </div>

      <div className="text-sm text-center">
        状态: {isConnected ? '已连接' : '未连接'}
      </div>
    </div>
  );
}
