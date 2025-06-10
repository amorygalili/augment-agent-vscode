import * as vscode from 'vscode';
import * as path from 'path';
import { AgentService, AgentConfig } from './agentService';
import { ChatWebviewProvider } from './chatWebviewProvider';
import { HistoryTreeProvider } from './historyTreeProvider';

let agentService: AgentService;
let chatProvider: ChatWebviewProvider;
let historyProvider: HistoryTreeProvider;

export function activate(context: vscode.ExtensionContext) {
	console.log('Coding Agent extension is now active!');

	// Initialize services
	const config = getAgentConfig();
	agentService = new AgentService(config);

	// Create providers
	chatProvider = new ChatWebviewProvider(context.extensionUri, agentService);
	historyProvider = new HistoryTreeProvider(agentService);

	// Register webview provider
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ChatWebviewProvider.viewType, chatProvider)
	);

	// Register tree data provider
	context.subscriptions.push(
		vscode.window.registerTreeDataProvider('coding-agent.historyView', historyProvider)
	);

	// Register commands
	registerCommands(context);

	// Listen for configuration changes
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('coding-agent')) {
				const newConfig = getAgentConfig();
				agentService.updateConfig(newConfig);
			}
		})
	);

	// Add agent service to subscriptions for cleanup
	context.subscriptions.push(agentService);
}

function registerCommands(context: vscode.ExtensionContext) {
	// Open chat command
	const openChatCommand = vscode.commands.registerCommand('coding-agent.openChat', () => {
		vscode.commands.executeCommand('coding-agent.chatView.focus');
	});

	// Clear history command
	const clearHistoryCommand = vscode.commands.registerCommand('coding-agent.clearHistory', () => {
		agentService.clearHistory();
		vscode.window.showInformationMessage('Chat history cleared');
	});

	// Show logs command
	const showLogsCommand = vscode.commands.registerCommand('coding-agent.showLogs', () => {
		vscode.commands.executeCommand('workbench.action.output.toggleOutput');
		vscode.commands.executeCommand('workbench.action.output.show.extension-output-augment-code.coding-agent-#1-Coding Agent');
	});

	// Open settings command
	const openSettingsCommand = vscode.commands.registerCommand('coding-agent.openSettings', () => {
		vscode.commands.executeCommand('workbench.action.openSettings', 'coding-agent');
	});

	// Copy message command
	const copyMessageCommand = vscode.commands.registerCommand('coding-agent.copyMessage', (content: string) => {
		vscode.env.clipboard.writeText(content);
		vscode.window.showInformationMessage('Message copied to clipboard');
	});

	// Refresh history command
	const refreshHistoryCommand = vscode.commands.registerCommand('coding-agent.refreshHistory', () => {
		historyProvider.refresh();
	});

	context.subscriptions.push(
		openChatCommand,
		clearHistoryCommand,
		showLogsCommand,
		openSettingsCommand,
		copyMessageCommand,
		refreshHistoryCommand
	);
}

function getAgentConfig(): AgentConfig {
	const config = vscode.workspace.getConfiguration('coding-agent');
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	const workspace = workspaceFolder ? workspaceFolder.uri.fsPath : process.cwd();

	return {
		pythonPath: config.get('pythonPath', 'python'),
		agentPath: config.get('agentPath', ''),
		workspace: workspace,
		openaiApiKey: config.get('openaiApiKey', ''),
		anthropicApiKey: config.get('anthropicApiKey', ''),
		askPermission: config.get('askPermission', true),
		maxTurns: config.get('maxTurns', 200),
		enableLogging: config.get('enableLogging', true)
	};
}

export function deactivate() {
	if (agentService) {
		agentService.dispose();
	}
}
