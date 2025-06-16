import React, { useState, useCallback } from 'react';
import { Box, TextField, IconButton, Tooltip } from '@mui/material';
import { Send, Clear, StopCircle } from '@mui/icons-material';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onClearHistory: () => void;
  onStopAgent: () => void;
  disabled?: boolean;
  isTyping?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onClearHistory,
  onStopAgent,
  disabled = false,
  isTyping = false,
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

  const handleStop = useCallback(() => {
    onStopAgent();
  }, [onStopAgent]);

  return (
    <Box
      sx={{
        p: 1,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ position: 'relative' }}>
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
              pr: 8, // Add padding right to make room for buttons
            },
            '& .MuiOutlinedInput-input': {
              py: 0.75,
            },
          }}
        />

        {/* Button container positioned inside the text field */}
        <Box
          sx={{
            position: 'absolute',
            right: 4,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            gap: 0.5,
            alignItems: 'center',
          }}
        >
          <Tooltip title="Clear chat history">
            <IconButton
              color="secondary"
              onClick={handleClear}
              size="small"
              sx={{ p: 0.5 }}
            >
              <Clear fontSize="small" />
            </IconButton>
          </Tooltip>

          {isTyping ? (
            <Tooltip title="Stop agent">
              <IconButton
                color="error"
                onClick={handleStop}
                size="small"
                sx={{ p: 0.5 }}
              >
                <StopCircle fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Send message">
              <span>
                <IconButton
                  color="primary"
                  onClick={handleSend}
                  disabled={disabled || !message.trim()}
                  size="small"
                  sx={{ p: 0.5 }}
                >
                  <Send fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Box>
  );
};
