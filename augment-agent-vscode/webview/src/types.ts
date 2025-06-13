export interface AgentMessage {
  id: string;
  type: 'user' | 'agent' | 'system' | 'error' | 'thinking' | 'debug' | 'tool_call' | 'tool_output';
  content: string;
  timestamp: Date;
  metadata?: any;
}

export interface VSCodeAPI {
  postMessage(message: any): void;
  getState(): any;
  setState(state: any): void;
}

export interface WebviewMessage {
  type: 'sendMessage' | 'clearHistory' | 'ready';
  message?: string;
}

export interface ExtensionMessage {
  type: 'addMessage' | 'loadHistory';
  message?: AgentMessage;
  messages?: AgentMessage[];
}

declare global {
  interface Window {
    acquireVsCodeApi(): VSCodeAPI;
  }
}
