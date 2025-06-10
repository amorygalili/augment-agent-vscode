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

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
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
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          disabled={disabled}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.default',
            },
          }}
        />
        
        <Tooltip title="Send message">
          <span>
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={disabled || !message.trim()}
              sx={{ mb: 0.5 }}
            >
              <Send />
            </IconButton>
          </span>
        </Tooltip>
        
        <Tooltip title="Clear chat history">
          <IconButton
            color="secondary"
            onClick={handleClear}
            sx={{ mb: 0.5 }}
          >
            <Clear />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
