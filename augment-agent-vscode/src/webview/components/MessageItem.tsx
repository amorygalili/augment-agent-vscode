import React from 'react';
import { Box, Paper, Typography, Chip, IconButton } from '@mui/material';
import { Person, SmartToy, Settings, Error, ContentCopy } from '@mui/icons-material';
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
    <Box sx={{ mb: 2 }}>
      <Paper
        elevation={1}
        sx={{
          p: 2,
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
            mb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={getMessageIcon(message.type)}
              label={message.type.toUpperCase()}
              size="small"
              color={getMessageColor(message.type) as any}
              variant="outlined"
            />
            <Typography variant="caption" color="text.secondary">
              {message.timestamp.toLocaleTimeString()}
            </Typography>
          </Box>
          
          <IconButton
            size="small"
            onClick={handleCopyMessage}
            sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
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
            '& code': {
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '0.9em',
            },
            '& pre': {
              backgroundColor: '#2d2d30',
              padding: '8px',
              borderRadius: '4px',
              overflow: 'auto',
              margin: '8px 0',
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
