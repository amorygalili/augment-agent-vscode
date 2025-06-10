import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export interface AgentMessage {
    id: string;
    type: 'user' | 'agent' | 'system' | 'error';
    content: string;
    timestamp: Date;
    metadata?: any;
}

export interface AgentConfig {
    pythonPath: string;
    agentPath: string;
    workspace: string;
    openaiApiKey?: string;
    anthropicApiKey?: string;
    askPermission: boolean;
    maxTurns: number;
    enableLogging: boolean;
}

export class AgentService {
    private process: cp.ChildProcess | null = null;
    private outputChannel: vscode.OutputChannel;
    private messageHistory: AgentMessage[] = [];
    private messageHandlers: ((message: AgentMessage) => void)[] = [];
    private isRunning = false;
    private currentWorkspace: string;

    constructor(private config: AgentConfig) {
        this.outputChannel = vscode.window.createOutputChannel('Coding Agent');
        this.currentWorkspace = config.workspace;

        // Send welcome message if in demo mode
        if (!config.agentPath) {
            setTimeout(() => {
                const welcomeMessage: AgentMessage = {
                    id: 'welcome-' + Date.now().toString(),
                    type: 'system',
                    content: '🎉 Welcome to Coding Agent! This is demo mode. Configure the agent path in settings to connect to the AI assistant.',
                    timestamp: new Date()
                };
                this.notifyHandlers(welcomeMessage);
            }, 500);
        }
    }

    public updateConfig(config: AgentConfig) {
        this.config = config;
        this.currentWorkspace = config.workspace;
    }

    public onMessage(handler: (message: AgentMessage) => void) {
        this.messageHandlers.push(handler);
    }

    public getMessageHistory(): AgentMessage[] {
        return [...this.messageHistory];
    }

    public clearHistory() {
        this.messageHistory = [];
        this.notifyHandlers({
            id: Date.now().toString(),
            type: 'system',
            content: 'Chat history cleared',
            timestamp: new Date()
        });
    }

    private notifyHandlers(message: AgentMessage) {
        this.messageHistory.push(message);
        this.messageHandlers.forEach(handler => handler(message));
    }

    private log(message: string, level: 'info' | 'error' | 'debug' = 'info') {
        if (this.config.enableLogging) {
            const timestamp = new Date().toISOString();
            const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
            this.outputChannel.appendLine(logMessage);
            
            if (level === 'error') {
                console.error(logMessage);
            } else if (level === 'debug') {
                console.debug(logMessage);
            } else {
                console.log(logMessage);
            }
        }
    }

    public async sendMessage(message: string): Promise<void> {
        if (!this.validateConfig()) {
            return;
        }

        const userMessage: AgentMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: message,
            timestamp: new Date()
        };

        this.notifyHandlers(userMessage);
        this.log(`User message: ${message}`);

        try {
            if (!this.config.agentPath) {
                // Demo mode - simulate agent response
                await this.simulateAgentResponse(message);
            } else {
                await this.startAgent();
                await this.sendToAgent(message);
            }
        } catch (error) {
            const errorMessage: AgentMessage = {
                id: Date.now().toString(),
                type: 'error',
                content: `Error: ${error instanceof Error ? error.message : String(error)}`,
                timestamp: new Date()
            };
            this.notifyHandlers(errorMessage);
            this.log(`Error sending message: ${error}`, 'error');
        }
    }

    private validateConfig(): boolean {
        // If no agent path is configured, we'll run in demo mode
        if (!this.config.agentPath) {
            this.log('No agent path configured, running in demo mode');
            return true;
        }

        if (!fs.existsSync(this.config.agentPath)) {
            vscode.window.showErrorMessage(`Coding Agent: Agent script not found at ${this.config.agentPath}`);
            return false;
        }

        if (!this.config.openaiApiKey && !this.config.anthropicApiKey) {
            vscode.window.showWarningMessage('Coding Agent: No API keys configured. Please set OpenAI or Anthropic API key in settings');
        }

        return true;
    }

    private async startAgent(): Promise<void> {
        if (this.isRunning && this.process) {
            return;
        }

        this.log('Starting augment-swebench-agent...');

        const args = [
            this.config.agentPath,
            '--workspace', this.currentWorkspace
        ];

        if (this.config.askPermission) {
            args.push('--needs-permission');
        }

        // Set environment variables
        const env = { ...process.env };
        if (this.config.openaiApiKey) {
            env.OPENAI_API_KEY = this.config.openaiApiKey;
        }
        if (this.config.anthropicApiKey) {
            env.ANTHROPIC_API_KEY = this.config.anthropicApiKey;
        }

        return new Promise((resolve, reject) => {
            this.process = cp.spawn(this.config.pythonPath, args, {
                cwd: this.currentWorkspace,
                env: env,
                stdio: ['pipe', 'pipe', 'pipe']
            });

            this.process.on('error', (error) => {
                this.log(`Process error: ${error.message}`, 'error');
                this.isRunning = false;
                reject(error);
            });

            this.process.on('exit', (code, signal) => {
                this.log(`Agent process exited with code ${code}, signal ${signal}`);
                this.isRunning = false;
                this.process = null;
            });

            if (this.process.stdout) {
                this.process.stdout.on('data', (data) => {
                    const output = data.toString();
                    this.handleAgentOutput(output);
                });
            }

            if (this.process.stderr) {
                this.process.stderr.on('data', (data) => {
                    const error = data.toString();
                    this.log(`Agent stderr: ${error}`, 'error');
                    
                    const errorMessage: AgentMessage = {
                        id: Date.now().toString(),
                        type: 'error',
                        content: error,
                        timestamp: new Date()
                    };
                    this.notifyHandlers(errorMessage);
                });
            }

            // Wait a bit for the process to start
            setTimeout(() => {
                if (this.process && !this.process.killed) {
                    this.isRunning = true;
                    this.log('Agent started successfully');
                    resolve();
                } else {
                    reject(new Error('Failed to start agent process'));
                }
            }, 1000);
        });
    }

    private handleAgentOutput(output: string) {
        this.log(`Agent output: ${output}`, 'debug');
        
        // Parse agent output and create appropriate messages
        const lines = output.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
            // Skip empty lines and debug output
            if (!line.trim() || line.includes('[DEBUG]')) {
                continue;
            }

            const message: AgentMessage = {
                id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                type: 'agent',
                content: line.trim(),
                timestamp: new Date()
            };

            this.notifyHandlers(message);
        }
    }

    private async simulateAgentResponse(userMessage: string): Promise<void> {
        // Simulate thinking time
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        const responses = [
            "I'm a demo version of the Coding Agent. To use the full functionality, please configure the agent path in settings.",
            "Hello! I can see your message, but I'm running in demo mode. Configure the agent path to connect to the real AI assistant.",
            "This is a demonstration of the React + Material UI interface. The real agent would analyze your code and provide intelligent assistance.",
            "Demo mode active! The interface is working perfectly. Set up the agent configuration to unlock AI-powered coding assistance.",
            `You said: "${userMessage}". In full mode, I would provide detailed code analysis and suggestions based on your workspace.`
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        const agentMessage: AgentMessage = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            type: 'agent',
            content: randomResponse,
            timestamp: new Date()
        };

        this.notifyHandlers(agentMessage);
        this.log(`Demo response: ${randomResponse}`);
    }

    private async sendToAgent(message: string): Promise<void> {
        if (!this.process || !this.process.stdin) {
            throw new Error('Agent process not available');
        }

        return new Promise((resolve, reject) => {
            if (this.process && this.process.stdin) {
                this.process.stdin.write(message + '\n', (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            } else {
                reject(new Error('Agent stdin not available'));
            }
        });
    }

    public async stopAgent(): Promise<void> {
        if (this.process) {
            this.log('Stopping agent process...');
            this.process.kill('SIGTERM');
            
            // Wait for graceful shutdown
            await new Promise<void>((resolve) => {
                if (this.process) {
                    this.process.on('exit', () => resolve());
                    setTimeout(() => {
                        if (this.process && !this.process.killed) {
                            this.process.kill('SIGKILL');
                        }
                        resolve();
                    }, 5000);
                } else {
                    resolve();
                }
            });
            
            this.process = null;
            this.isRunning = false;
        }
    }

    public dispose() {
        this.stopAgent();
        this.outputChannel.dispose();
    }
}
