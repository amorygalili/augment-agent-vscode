import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { MessageItem } from './MessageItem';
import { AgentMessage, ToolCallState } from '../types';

interface MessageListProps {
  messages: AgentMessage[];
  toolCallStates?: Record<string, ToolCallState>;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, toolCallStates = {} }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        p: 0.5,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#424242',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        },
      }}
    >
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          toolCallState={toolCallStates[message.id]}
        />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};
