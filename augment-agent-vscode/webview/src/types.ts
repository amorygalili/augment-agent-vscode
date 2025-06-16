export interface AgentMessage {
  id: string;
  type: 'user' | 'agent' | 'system' | 'error' | 'thinking' | 'debug' | 'tool_call' | 'tool_output';
  content: string;
  timestamp: Date;
  metadata?: any;
}

export interface ToolCallState {
  status: 'pending' | 'completed' | 'interrupted';
  toolName?: string;
  toolInput?: any;
  output?: string;
  outputMessageId?: string;
}

export interface VSCodeAPI {
  postMessage(message: any): void;
  getState(): any;
  setState(state: any): void;
}

export interface WebviewMessage {
  type: 'sendMessage' | 'clearHistory' | 'ready' | 'stopAgent';
  message?: string;
}

export interface ExtensionMessage {
  type: 'addMessage' | 'loadHistory' | 'updateToolCallState';
  message?: AgentMessage;
  messages?: AgentMessage[];
  toolCallStates?: Record<string, ToolCallState>;
  toolCallId?: string;
  state?: ToolCallState;
}

declare global {
  interface Window {
    acquireVsCodeApi(): VSCodeAPI;
  }
}
