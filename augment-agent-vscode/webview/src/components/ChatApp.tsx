import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { WelcomeMessage } from './WelcomeMessage';
import { TypingIndicator } from './TypingIndicator';
import { AgentMessage, VSCodeAPI, WebviewMessage, ExtensionMessage } from '../types';

// Global VSCode API instance to avoid multiple acquisitions
let vscodeApi: VSCodeAPI | null = null;

const getVSCodeAPI = (): VSCodeAPI => {
  if (!vscodeApi) {
    vscodeApi = window.acquireVsCodeApi();
  }
  return vscodeApi;
};

export const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [vscode] = useState<VSCodeAPI>(() => getVSCodeAPI());

  const handleSendMessage = useCallback((content: string) => {
    if (content.trim() && !isTyping) {
      try {
        const message: WebviewMessage = {
          type: 'sendMessage',
          message: content,
        };
        vscode.postMessage(message);
        setIsTyping(true);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }, [vscode, isTyping]);

  const handleClearHistory = useCallback(() => {
    try {
      const message: WebviewMessage = {
        type: 'clearHistory',
      };
      vscode.postMessage(message);
      setMessages([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }, [vscode]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const message: ExtensionMessage = event.data;

        switch (message.type) {
          case 'addMessage':
            if (message.message) {
              setMessages(prev => [...prev, {
                ...message.message!,
                timestamp: new Date(message.message!.timestamp)
              }]);

              // If this is an agent or error message, stop typing
              if (message.message.type === 'agent' || message.message.type === 'error') {
                setIsTyping(false);
              }
            }
            break;

          case 'loadHistory':
            if (message.messages) {
              setMessages(message.messages.map(msg => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
              })));
            }
            break;
        }
      } catch (error) {
        console.error('Error handling message:', error);
      }
    };

    window.addEventListener('message', handleMessage);

    // Notify extension that webview is ready
    try {
      vscode.postMessage({ type: 'ready' });
    } catch (error) {
      console.error('Error sending ready message:', error);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [vscode]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 1,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="subtitle1" component="h1" sx={{ fontWeight: 600 }}>
          Coding Agent
        </Typography>
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.length === 0 ? (
          <WelcomeMessage />
        ) : (
          <MessageList messages={messages} />
        )}
        
        {isTyping && <TypingIndicator />}
      </Box>

      {/* Input Area */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onClearHistory={handleClearHistory}
        disabled={isTyping}
      />
    </Box>
  );
};
