import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Code, BugReport, PlayArrow, Search } from '@mui/icons-material';

export const WelcomeMessage: React.FC = () => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 1.5,
      }}
    >
      <Box sx={{ maxWidth: 350, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
          Welcome to Coding Agent!
        </Typography>

        <Typography variant="body2" paragraph color="text.secondary" sx={{ fontSize: '0.8rem' }}>
          I'm an AI-powered software engineering assistant.
        </Typography>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, fontSize: '0.85rem' }}>
          I can help you with:
        </Typography>

        <List dense>
          <ListItem sx={{ py: 0.25 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <Code color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Code analysis and debugging"
              primaryTypographyProps={{ variant: 'body2', fontSize: '0.75rem' }}
            />
          </ListItem>

          <ListItem sx={{ py: 0.25 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <BugReport color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Writing and modifying code"
              primaryTypographyProps={{ variant: 'body2', fontSize: '0.75rem' }}
            />
          </ListItem>

          <ListItem sx={{ py: 0.25 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <PlayArrow color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Running tests and commands"
              primaryTypographyProps={{ variant: 'body2', fontSize: '0.75rem' }}
            />
          </ListItem>

          <ListItem sx={{ py: 0.25 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <Search color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Exploring codebases"
              primaryTypographyProps={{ variant: 'body2', fontSize: '0.75rem' }}
            />
          </ListItem>
        </List>

        <Typography variant="body2" sx={{ mt: 1.5, fontSize: '0.75rem' }} color="text.secondary">
          Type your message below to get started!
        </Typography>
      </Box>
    </Box>
  );
};
