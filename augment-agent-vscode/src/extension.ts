import * as vscode from 'vscode';
import { AgentService, AgentConfig } from './agentService';
import { ChatWebviewProvider } from './chatWebviewProvider';
import { HistoryTreeProvider } from './historyTreeProvider';

let agentService: AgentService;
let chatProvider: ChatWebviewProvider;
let historyProvider: HistoryTreeProvider;

export function activate(context: vscode.ExtensionContext) {
	console.log('Coding Agent extension is now active!');

	try {
		// Initialize services
		console.log('Extension: Getting agent configuration');
		const config = getAgentConfig();
		console.log('Extension: Creating AgentService with config:', config);

		agentService = new AgentService(config);
		console.log('Extension: AgentService created successfully');

		// Create providers
		console.log('Extension: Creating webview and history providers');
		chatProvider = new ChatWebviewProvider(context.extensionUri, agentService);
		historyProvider = new HistoryTreeProvider(agentService);
		console.log('Extension: Providers created successfully');

		// Register webview provider
		console.log('Extension: Registering webview provider');
		context.subscriptions.push(
			vscode.window.registerWebviewViewProvider(ChatWebviewProvider.viewType, chatProvider)
		);

		// Register tree data provider
		console.log('Extension: Registering tree data provider');
		context.subscriptions.push(
			vscode.window.registerTreeDataProvider('coding-agent.historyView', historyProvider)
		);

		// Register commands
		console.log('Extension: Registering commands');
		registerCommands(context);

		// Listen for configuration changes
		console.log('Extension: Setting up configuration change listener');
		context.subscriptions.push(
			vscode.workspace.onDidChangeConfiguration(e => {
				if (e.affectsConfiguration('coding-agent')) {
					console.log('Extension: Configuration changed, updating agent service');
					const newConfig = getAgentConfig();
					agentService.updateConfig(newConfig);
				}
			})
		);

		// Add agent service to subscriptions for cleanup
		context.subscriptions.push(agentService);

		console.log('Extension: Activation completed successfully');
	} catch (error) {
		console.error('Extension: Activation failed:', error);
		vscode.window.showErrorMessage(`Coding Agent activation failed: ${error instanceof Error ? error.message : String(error)}`);
	}
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
		// Show the output panel and select our channel
		vscode.commands.executeCommand('workbench.action.output.show');
		// The output channel should be available as "Coding Agent"
		vscode.commands.executeCommand('workbench.action.output.show', 'Coding Agent');
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

	// Debug command to test logging
	const debugCommand = vscode.commands.registerCommand('coding-agent.debug', () => {
		console.log('Extension: Debug command triggered');
		const config = getAgentConfig();
		console.log('Extension: Current config:', JSON.stringify(config, null, 2));
		vscode.window.showInformationMessage('Debug info logged to console and output channel');
	});

	context.subscriptions.push(
		openChatCommand,
		clearHistoryCommand,
		showLogsCommand,
		openSettingsCommand,
		copyMessageCommand,
		refreshHistoryCommand,
		debugCommand
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
