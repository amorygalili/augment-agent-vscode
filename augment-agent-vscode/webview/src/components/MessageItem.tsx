import React from 'react';
import { Box, Paper, Typography, Chip, IconButton } from '@mui/material';
import { Person, SmartToy, Settings, Error, ContentCopy, Psychology, Build, Code, Terminal } from '@mui/icons-material';
import { AgentMessage } from '../types';

interface MessageItemProps {
  message: AgentMessage;
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

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
  };

  const processContent = (content: string) => {
    // Basic markdown-like processing for display
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background-color: #2d2d30; padding: 2px 4px; border-radius: 3px;">$1</code>')
      .replace(/\n/g, '<br>');
  };

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
        <Typography
          variant="body2"
          component="div"
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontSize: '0.8rem',
            lineHeight: 1.3,
            '& code': {
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '0.75rem',
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
          }}
          dangerouslySetInnerHTML={{
            __html: processContent(message.content),
          }}
        />
      </Paper>
    </Box>
  );
};
