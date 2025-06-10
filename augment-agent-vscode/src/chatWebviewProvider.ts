import * as vscode from 'vscode';
import { AgentService, AgentMessage } from './agentService';

export class ChatWebviewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'coding-agent.chatView';
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly agentService: AgentService
    ) {
        // Listen for agent messages
        this.agentService.onMessage((message) => {
            this.addMessage(message);
        });
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'sendMessage':
                    await this.agentService.sendMessage(data.message);
                    break;
                case 'clearHistory':
                    this.agentService.clearHistory();
                    this.refreshWebview();
                    break;
                case 'ready':
                    // Webview is ready, load existing messages
                    this.loadExistingMessages();
                    break;
            }
        });
    }

    private addMessage(message: AgentMessage) {
        if (this._view) {
            this._view.webview.postMessage({
                type: 'addMessage',
                message: message
            });
        }
    }

    private loadExistingMessages() {
        const history = this.agentService.getMessageHistory();
        if (this._view) {
            this._view.webview.postMessage({
                type: 'loadHistory',
                messages: history
            });
        }
    }

    private refreshWebview() {
        if (this._view) {
            this._view.webview.html = this._getHtmlForWebview(this._view.webview);
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
        const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleResetUri}" rel="stylesheet">
                <link href="${styleVSCodeUri}" rel="stylesheet">
                <link href="${styleMainUri}" rel="stylesheet">
                <title>Coding Agent Chat</title>
            </head>
            <body>
                <div class="chat-container">
                    <div class="chat-header">
                        <h3>Coding Agent</h3>
                        <button id="clearBtn" class="clear-button" title="Clear chat history">
                            <span class="codicon codicon-clear-all"></span>
                        </button>
                    </div>
                    <div id="messagesContainer" class="messages-container">
                        <div class="welcome-message">
                            <p>Welcome to Augment Agent! I'm an AI-powered software engineering assistant.</p>
                            <p>I can help you with:</p>
                            <ul>
                                <li>Code analysis and debugging</li>
                                <li>Writing and modifying code</li>
                                <li>Running tests and commands</li>
                                <li>Exploring codebases</li>
                            </ul>
                            <p>Type your message below to get started!</p>
                        </div>
                    </div>
                    <div class="input-container">
                        <div class="input-wrapper">
                            <textarea id="messageInput" placeholder="Type your message here..." rows="3"></textarea>
                            <button id="sendBtn" class="send-button" title="Send message">
                                <span class="codicon codicon-send"></span>
                            </button>
                        </div>
                    </div>
                </div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
