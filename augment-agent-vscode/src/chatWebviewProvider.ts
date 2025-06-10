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
        _context: vscode.WebviewViewResolveContext,
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
        // Get the React bundle
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview', 'bundle.js'));

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline' 'unsafe-eval'; script-src 'nonce-${nonce}' 'unsafe-eval'; font-src ${webview.cspSource} data:; img-src ${webview.cspSource} data:;">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Coding Agent Chat</title>
                <style>
                    body {
                        background: #1e1e1e;
                        color: #cccccc;
                        font-family: 'Segoe UI', sans-serif;
                        margin: 0;
                        padding: 20px;
                    }
                    .loading {
                        text-align: center;
                        padding: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="loading">Loading Coding Agent...</div>
                <div id="root"></div>
                <script nonce="${nonce}">
                    console.log('Webview HTML loaded');
                    document.querySelector('.loading').textContent = 'Loading React app...';
                </script>
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
