import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  ExpandMore,
  Build,
  CheckCircle,
  StopCircle,
  ContentCopy,
} from '@mui/icons-material';
import { AgentMessage, ToolCallState } from '../types';

interface ToolCallAccordionProps {
  toolCallMessage: AgentMessage;
  toolCallState: ToolCallState;
  onCopy?: (content: string) => void;
}

export const ToolCallAccordion: React.FC<ToolCallAccordionProps> = ({
  toolCallMessage,
  toolCallState,
  onCopy,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const handleCopyToolCall = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onCopy) {
      onCopy(toolCallMessage.content);
    } else {
      navigator.clipboard.writeText(toolCallMessage.content);
    }
  };

  const handleCopyOutput = (event: React.MouseEvent) => {
    event.stopPropagation();
    const outputContent = toolCallState.output || '';
    if (onCopy) {
      onCopy(outputContent);
    } else {
      navigator.clipboard.writeText(outputContent);
    }
  };

  const getStatusIcon = () => {
    switch (toolCallState.status) {
      case 'pending':
        return <CircularProgress size={16} sx={{ color: 'warning.main' }} />;
      case 'completed':
        return <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />;
      case 'interrupted':
        return <StopCircle sx={{ color: 'error.main', fontSize: 16 }} />;
      default:
        return <Build sx={{ fontSize: 16 }} />;
    }
  };

  const getStatusColor = () => {
    switch (toolCallState.status) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'interrupted':
        return 'error';
      default:
        return 'default';
    }
  };

  const getToolName = () => {
    return toolCallState.toolName || 
           toolCallMessage.metadata?.tool_name || 
           'Unknown Tool';
  };

  const getToolSummary = () => {
    const toolName = getToolName();
    const status = toolCallState.status;
    
    if (status === 'pending') {
      return `${toolName} - Running...`;
    } else if (status === 'interrupted') {
      return `${toolName} - Interrupted`;
    } else {
      return `${toolName} - Completed`;
    }
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
    <Box sx={{ mb: 1 }}>
      <Accordion
        expanded={expanded}
        onChange={handleExpandChange}
        sx={{
          bgcolor: 'background.paper',
          '&:before': {
            display: 'none',
          },
          '& .MuiAccordionSummary-root': {
            minHeight: 48,
            '&.Mui-expanded': {
              minHeight: 48,
            },
          },
          '& .MuiAccordionSummary-content': {
            '&.Mui-expanded': {
              margin: '12px 0',
            },
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            '& .MuiAccordionSummary-expandIconWrapper': {
              color: 'text.secondary',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              mr: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getStatusIcon()}
              <Chip
                icon={<Build fontSize="small" />}
                label="TOOL CALL"
                size="small"
                color={getStatusColor() as any}
                variant="outlined"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  '& .MuiChip-label': { px: 0.5 },
                  '& .MuiChip-icon': { fontSize: '0.8rem' }
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {getToolSummary()}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                {toolCallMessage.timestamp.toLocaleTimeString()}
              </Typography>
            </Box>

            <IconButton
              size="small"
              onClick={handleCopyToolCall}
              sx={{
                opacity: 0.7,
                '&:hover': { opacity: 1 },
                p: 0.25
              }}
            >
              <ContentCopy fontSize="small" />
            </IconButton>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ pt: 0 }}>
          {/* Tool Call Details */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Tool Call:
            </Typography>
            <Typography
              variant="body2"
              component="div"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: '0.8rem',
                lineHeight: 1.3,
                bgcolor: 'background.default',
                p: 1,
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
                '& code': {
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  fontSize: '0.75rem',
                },
              }}
              dangerouslySetInnerHTML={{
                __html: processContent(toolCallMessage.content),
              }}
            />
          </Box>

          {/* Tool Output */}
          {toolCallState.output && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Tool Output:
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleCopyOutput}
                  sx={{
                    opacity: 0.7,
                    '&:hover': { opacity: 1 },
                    p: 0.25
                  }}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Box>
              <Typography
                variant="body2"
                component="div"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontSize: '0.8rem',
                  lineHeight: 1.3,
                  bgcolor: 'background.default',
                  p: 1,
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'divider',
                  '& code': {
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    fontSize: '0.75rem',
                  },
                }}
                dangerouslySetInnerHTML={{
                  __html: processContent(toolCallState.output),
                }}
              />
            </Box>
          )}

          {/* Pending State Message */}
          {toolCallState.status === 'pending' && !toolCallState.output && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Waiting for tool output...
              </Typography>
            </Box>
          )}

          {/* Interrupted State Message */}
          {toolCallState.status === 'interrupted' && !toolCallState.output && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="error">
                Tool execution was interrupted
              </Typography>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
