import React from 'react';
import { Box, Paper, Typography, Chip, IconButton } from '@mui/material';
import { Person, SmartToy, Settings, Error, ContentCopy, Psychology, Build, Code, Terminal } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AgentMessage, ToolCallState } from '../types';
import { ToolCallAccordion } from './ToolCallAccordion';

interface MessageItemProps {
  message: AgentMessage;
  toolCallState?: ToolCallState;
}

const getMessageIcon = (type: string) => {
  switch (type) {
    case 'user':
      return <Person fontSize="small" />;
    case 'agent':
      return <SmartToy fontSize="small" />;
    case 'system':
      return <Settings fontSize="small" />;
    case 'error':
      return <Error fontSize="small" />;
    case 'thinking':
      return <Psychology fontSize="small" />;
    case 'debug':
      return <Code fontSize="small" />;
    case 'tool_call':
      return <Build fontSize="small" />;
    case 'tool_output':
      return <Terminal fontSize="small" />;
    default:
      return <SmartToy fontSize="small" />;
  }
};

const getMessageColor = (type: string) => {
  switch (type) {
    case 'user':
      return 'primary';
    case 'agent':
      return 'secondary';
    case 'system':
      return 'default';
    case 'error':
      return 'error';
    case 'thinking':
      return 'info';
    case 'debug':
      return 'warning';
    case 'tool_call':
      return 'success';
    case 'tool_output':
      return 'info';
    default:
      return 'default';
  }
};

export const MessageItem: React.FC<MessageItemProps> = ({ message, toolCallState }) => {
  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
  };



  // Use ToolCallAccordion for tool_call messages
  if (message.type === 'tool_call' && toolCallState) {
    return (
      <ToolCallAccordion
        toolCallMessage={message}
        toolCallState={toolCallState}
        onCopy={handleCopyMessage}
      />
    );
  }

  // Hide tool_output messages that are part of an accordion
  // (they will be displayed inside the ToolCallAccordion)
  if (message.type === 'tool_output') {
    return null;
  }

  return (
    <Box sx={{ mb: 1 }}>
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          bgcolor: message.type === 'user' ? 'primary.dark' : 'background.paper',
          border: message.type === 'error' ? 2 : 0,
          borderColor: 'error.main',
        }}
      >
        {/* Message Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 0.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip
              icon={getMessageIcon(message.type)}
              label={message.type.toUpperCase()}
              size="small"
              color={getMessageColor(message.type) as any}
              variant="outlined"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                '& .MuiChip-label': { px: 0.5 },
                '& .MuiChip-icon': { fontSize: '0.8rem' }
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              {message.timestamp.toLocaleTimeString()}
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={handleCopyMessage}
            sx={{
              opacity: 0.7,
              '&:hover': { opacity: 1 },
              p: 0.25
            }}
          >
            <ContentCopy fontSize="small" />
          </IconButton>
        </Box>

        {/* Message Content */}
        <Box
          sx={{
            fontSize: '0.8rem',
            lineHeight: 1.3,
            '& h1': {
              margin: '16px 0 8px 0',
              fontSize: '1.2rem',
              fontWeight: 600,
            },
            '& h2': {
              margin: '12px 0 6px 0',
              fontSize: '1.1rem',
              fontWeight: 600,
            },
            '& h3': {
              margin: '8px 0 4px 0',
              fontSize: '1rem',
              fontWeight: 600,
            },
            '& p': {
              margin: '4px 0',
            },
            '& code': {
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '0.75rem',
              backgroundColor: '#2d2d30',
              padding: '2px 4px',
              borderRadius: '3px',
            },
            '& pre': {
              backgroundColor: '#2d2d30',
              padding: '6px',
              borderRadius: '3px',
              overflow: 'auto',
              margin: '4px 0',
              '& code': {
                backgroundColor: 'transparent',
                padding: 0,
              },
            },
            '& ul, & ol': {
              margin: '4px 0',
              paddingLeft: '20px',
            },
            '& li': {
              margin: '2px 0',
            },
            '& blockquote': {
              borderLeft: '4px solid #555',
              paddingLeft: '12px',
              margin: '8px 0',
              fontStyle: 'italic',
            },
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </Box>
      </Paper>
    </Box>
  );
};
