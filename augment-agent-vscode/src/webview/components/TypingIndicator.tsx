import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import { SmartToy } from '@mui/icons-material';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0%, 60%, 100% {
    transform: initial;
  }
  30% {
    transform: translateY(-10px);
  }
`;

const TypingDots: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      gap: 0.5,
      alignItems: 'center',
    }}
  >
    {[0, 1, 2].map((index) => (
      <Box
        key={index}
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          animation: `${pulse} 1.4s ease-in-out infinite`,
          animationDelay: `${index * 0.16}s`,
        }}
      />
    ))}
  </Box>
);

export const TypingIndicator: React.FC = () => {
  return (
    <Box sx={{ p: 1, mb: 2 }}>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          maxWidth: 200,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Chip
            icon={<SmartToy />}
            label="AGENT"
            size="small"
            color="secondary"
            variant="outlined"
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Agent is thinking
          </Typography>
          <TypingDots />
        </Box>
      </Paper>
    </Box>
  );
};
