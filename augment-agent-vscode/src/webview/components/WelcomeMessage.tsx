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
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: 400, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom color="primary">
          Welcome to Coding Agent!
        </Typography>
        
        <Typography variant="body1" paragraph color="text.secondary">
          I'm an AI-powered software engineering assistant.
        </Typography>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          I can help you with:
        </Typography>
        
        <List>
          <ListItem>
            <ListItemIcon>
              <Code color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Code analysis and debugging"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <BugReport color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Writing and modifying code"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <PlayArrow color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Running tests and commands"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <Search color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Exploring codebases"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        </List>
        
        <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
          Type your message below to get started!
        </Typography>
      </Box>
    </Box>
  );
};
