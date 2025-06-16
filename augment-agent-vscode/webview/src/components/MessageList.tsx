import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { MessageItem } from './MessageItem';
import { AgentMessage, ToolCallState } from '../types';

interface MessageListProps {
  messages: AgentMessage[];
  toolCallStates?: Record<string, ToolCallState>;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, toolCallStates = {} }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [previousMessageCount, setPreviousMessageCount] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkIfNearBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return true;

    const threshold = 100; // pixels from bottom to consider "near bottom"
    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    return distanceFromBottom <= threshold;
  }, []);

  const handleScroll = useCallback(() => {
    setIsNearBottom(checkIfNearBottom());
  }, [checkIfNearBottom]);

  // Smart scrolling: only auto-scroll if user was near bottom when new messages arrive
  useEffect(() => {
    const hasNewMessages = messages.length > previousMessageCount;

    if (hasNewMessages && isNearBottom) {
      scrollToBottom();
    }

    setPreviousMessageCount(messages.length);
  }, [messages, isNearBottom, previousMessageCount]);

  // Set up scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    setIsNearBottom(checkIfNearBottom());

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, checkIfNearBottom]);

  return (
    <Box
      ref={scrollContainerRef}
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
