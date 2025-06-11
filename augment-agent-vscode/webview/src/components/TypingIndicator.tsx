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
      gap: 0.25,
      alignItems: 'center',
    }}
  >
    {[0, 1, 2].map((index) => (
      <Box
        key={index}
        sx={{
          width: 4,
          height: 4,
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
    <Box sx={{ p: 0.5, mb: 1 }}>
      <Paper
        elevation={1}
        sx={{
          p: 1,
          bgcolor: 'background.paper',
          maxWidth: 180,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Chip
            icon={<SmartToy fontSize="small" />}
            label="AGENT"
            size="small"
            color="secondary"
            variant="outlined"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              '& .MuiChip-label': { px: 0.5 },
              '& .MuiChip-icon': { fontSize: '0.8rem' }
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            is thinking
          </Typography>
          <TypingDots />
        </Box>
      </Paper>
    </Box>
  );
};
