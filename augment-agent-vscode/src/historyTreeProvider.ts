import * as vscode from 'vscode';
import { AgentService, AgentMessage } from './agentService';

export class HistoryTreeProvider implements vscode.TreeDataProvider<HistoryItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<HistoryItem | undefined | null | void> = new vscode.EventEmitter<HistoryItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<HistoryItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private agentService: AgentService) {
        // Listen for new messages
        this.agentService.onMessage(() => {
            this.refresh();
        });
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: HistoryItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: HistoryItem): Thenable<HistoryItem[]> {
        if (!element) {
            // Root level - show conversation sessions
            return Promise.resolve(this.getConversationSessions());
        } else if (element.contextValue === 'session') {
            // Show messages in this session
            return Promise.resolve(this.getMessagesInSession(element.sessionId!));
        }
        return Promise.resolve([]);
    }

    private getConversationSessions(): HistoryItem[] {
        const messages = this.agentService.getMessageHistory();
        if (messages.length === 0) {
            return [];
        }

        // Group messages by conversation sessions (simplified - just one session for now)
        const sessionStart = messages[0].timestamp;
        const sessionEnd = messages[messages.length - 1].timestamp;
        const messageCount = messages.length;

        const sessionItem = new HistoryItem(
            `Session ${sessionStart.toLocaleDateString()} ${sessionStart.toLocaleTimeString()}`,
            vscode.TreeItemCollapsibleState.Expanded,
            'session'
        );
        sessionItem.description = `${messageCount} messages`;
        sessionItem.sessionId = 'current';
        sessionItem.tooltip = `Started: ${sessionStart.toLocaleString()}\nLast message: ${sessionEnd.toLocaleString()}\nMessages: ${messageCount}`;

        return [sessionItem];
    }

    private getMessagesInSession(sessionId: string): HistoryItem[] {
        const messages = this.agentService.getMessageHistory();
        
        return messages.map((message, index) => {
            const truncatedContent = message.content.length > 50 
                ? message.content.substring(0, 50) + '...'
                : message.content;

            const item = new HistoryItem(
                truncatedContent,
                vscode.TreeItemCollapsibleState.None,
                'message'
            );

            // Set icon based on message type
            switch (message.type) {
                case 'user':
                    item.iconPath = new vscode.ThemeIcon('person');
                    break;
                case 'agent':
                    item.iconPath = new vscode.ThemeIcon('robot');
                    break;
                case 'system':
                    item.iconPath = new vscode.ThemeIcon('gear');
                    break;
                case 'error':
                    item.iconPath = new vscode.ThemeIcon('error');
                    break;
            }

            item.description = message.type;
            item.tooltip = `${message.type.toUpperCase()}\n${message.timestamp.toLocaleString()}\n\n${message.content}`;
            item.messageId = message.id;

            // Add command to copy message content
            item.command = {
                command: 'coding-agent.copyMessage',
                title: 'Copy Message',
                arguments: [message.content]
            };

            return item;
        });
    }
}

export class HistoryItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly contextValue: string
    ) {
        super(label, collapsibleState);
    }

    sessionId?: string;
    messageId?: string;
}
