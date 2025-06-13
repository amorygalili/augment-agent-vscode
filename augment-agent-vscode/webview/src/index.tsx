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

// Get VSCode API from global window object (already acquired in HTML)
const vscode = (window as any).vscode;

const container = document.getElementById('root');
if (container) {
  console.log('Root container found, rendering React app');

  try {
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
    console.log('React app rendered successfully');

    // Hide loading message
    const loadingEl = document.querySelector('.loading');
    if (loadingEl) {
      (loadingEl as HTMLElement).style.display = 'none';
    }

    // Notify extension that webview is ready
    setTimeout(() => {
      vscode.postMessage({ type: 'ready' });
      console.log('Sent ready message to extension');
    }, 100);

  } catch (error) {
    console.error('Error rendering React app:', error);
    vscode.postMessage({
      type: 'error',
      error: `React render error: ${error instanceof Error ? error.message : String(error)}`
    });

    // Show error in UI
    container.innerHTML = `<div style="color: #f48771; padding: 20px; text-align: center; border: 1px solid #f48771; border-radius: 4px; margin: 20px;">
      <h3>Failed to load React app</h3>
      <p>${error instanceof Error ? error.message : String(error)}</p>
    </div>`;
  }
} else {
  console.error('Root container not found!');
  vscode.postMessage({
    type: 'error',
    error: 'Root container not found'
  });

  // Fallback: show a simple message
  document.body.innerHTML = '<div style="color: #f48771; padding: 20px; text-align: center; border: 1px solid #f48771; border-radius: 4px; margin: 20px;">Error: Root container not found. Webview failed to initialize.</div>';
}

// Add global error handlers
window.addEventListener('error', (event) => {
  console.error('Webview error:', event.error);
  vscode.postMessage({
    type: 'error',
    error: `Global error: ${event.error ? event.error.message : 'Unknown error'}`
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  vscode.postMessage({
    type: 'error',
    error: `Promise rejection: ${event.reason ? event.reason.toString() : 'Unknown reason'}`
  });
});
