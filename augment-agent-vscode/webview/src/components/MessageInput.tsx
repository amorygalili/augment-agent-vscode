import React, { useState, useCallback } from 'react';
import { Box, TextField, IconButton, Tooltip } from '@mui/material';
import { Send, Clear } from '@mui/icons-material';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onClearHistory: () => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onClearHistory,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');

  const handleSend = useCallback(() => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  }, [message, disabled, onSendMessage]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleClear = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      onClearHistory();
    }
  }, [onClearHistory]);

  return (
    <Box
      sx={{
        p: 1,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end' }}>
        <TextField
          fullWidth
          multiline
          maxRows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          disabled={disabled}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.default',
              fontSize: '0.8rem',
            },
            '& .MuiOutlinedInput-input': {
              py: 0.75,
            },
          }}
        />
        
        <Tooltip title="Send message">
          <span>
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={disabled || !message.trim()}
              size="small"
              sx={{ mb: 0.25, p: 0.5 }}
            >
              <Send fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Clear chat history">
          <IconButton
            color="secondary"
            onClick={handleClear}
            size="small"
            sx={{ mb: 0.25, p: 0.5 }}
          >
            <Clear fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
