import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ChatApp } from './components/ChatApp';
import { ErrorBoundary } from './components/ErrorBoundary';

// Create a dark theme that matches VSCode
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#007acc',
    },
    background: {
      default: '#1e1e1e',
      paper: '#252526',
    },
    text: {
      primary: '#cccccc',
      secondary: '#969696',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    fontSize: 12,
    body1: {
      fontSize: '0.8rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
    caption: {
      fontSize: '0.7rem',
    },
  },
  spacing: 6, // Reduce default spacing from 8 to 6
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          height: '100vh',
          overflow: 'hidden',
        },
        '#root': {
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove default elevation shadows
        },
      },
    },
  },
});

console.log('Webview script loaded');

const container = document.getElementById('root');
if (container) {
  console.log('Root container found, rendering React app');
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <ChatApp />
        </ErrorBoundary>
      </ThemeProvider>
    </React.StrictMode>
  );
  console.log('React app rendered');
} else {
  console.error('Root container not found!');
  // Fallback: show a simple message
  document.body.innerHTML = '<div style="color: white; padding: 20px;">Error: Root container not found. Webview failed to initialize.</div>';
}

// Add error boundary
window.addEventListener('error', (event) => {
  console.error('Webview error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
