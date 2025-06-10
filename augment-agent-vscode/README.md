# Coding Agent VSCode Extension

A VSCode extension that integrates with [augment-swebench-agent](https://github.com/augment-code/augment-swebench-agent) to provide AI-powered software engineering assistance directly in your editor.

## Features

- **Interactive Agent Chat**: Communicate with the AI agent through a dedicated chat interface in the sidebar
- **Prompt History**: View and manage your conversation history with the agent
- **Workspace Integration**: The agent operates within your current workspace context
- **Multiple LLM Support**: Works with both OpenAI (GPT) and Anthropic (Claude) models
- **Command Execution**: Agent can execute bash commands and file operations with your permission
- **Comprehensive Logging**: Detailed logging for debugging and monitoring agent activities

## Requirements

1. **Python 3.11+**: Required to run the augment-swebench-agent
2. **augment-swebench-agent**: Clone and set up the agent from [the repository](https://github.com/augment-code/augment-swebench-agent)
3. **API Keys**: Either OpenAI API key or Anthropic API key (or both)

## Installation & Setup

### 1. Install augment-swebench-agent

```bash
git clone https://github.com/augment-code/augment-swebench-agent.git
cd augment-swebench-agent
pip install -e .
```

### 2. Install the VSCode Extension

1. Open VSCode
2. Go to Extensions (Ctrl+Shift+X)
3. Install "Coding Agent" extension
4. Reload VSCode

### 3. Configure the Extension

Open VSCode settings (Ctrl+,) and configure:

- **Agent Path**: Full path to the `cli.py` file in your augment-swebench-agent installation
- **Python Path**: Path to your Python executable (default: "python")
- **API Keys**: Set your OpenAI and/or Anthropic API keys
- **Other Settings**: Adjust permissions, logging, and behavior as needed

## Extension Settings

This extension contributes the following settings:

- `coding-agent.agentPath`: Path to augment-swebench-agent CLI script (cli.py)
- `coding-agent.pythonPath`: Path to Python executable for running the agent
- `coding-agent.openaiApiKey`: OpenAI API Key for GPT models
- `coding-agent.anthropicApiKey`: Anthropic API Key for Claude models
- `coding-agent.askPermission`: Ask for permission before executing commands (default: true)
- `coding-agent.maxTurns`: Maximum number of conversation turns (default: 200)
- `coding-agent.enableLogging`: Enable detailed logging (default: true)

## Usage

1. **Open the Agent Chat**: Click the robot icon in the activity bar or use the command palette (Ctrl+Shift+P) and search for "Open Coding Agent Chat"

2. **Start Chatting**: Type your message in the input field and press Enter or click the send button

3. **View History**: Check the "Prompt History" section to see your conversation history

4. **Monitor Logs**: Use "Show Agent Logs" command to view detailed agent activity logs

## Example Use Cases

- **Code Review**: "Please review this function and suggest improvements"
- **Bug Fixing**: "There's a bug in my authentication logic, can you help debug it?"
- **Feature Implementation**: "I need to add user authentication to this Flask app"
- **Testing**: "Write unit tests for the UserService class"
- **Documentation**: "Generate documentation for this API endpoint"

## Known Issues

- Agent startup may take a few seconds on first use
- Large codebases may require longer processing times
- Some complex file operations may require manual confirmation

## Development

To contribute to this extension:

1. Clone this repository
2. Run `npm install` in the extension directory
3. Open in VSCode and press F5 to launch a new Extension Development Host
4. Make changes and test in the development environment

## Release Notes

### 0.0.1

Initial release with core features:
- Agent chat interface
- Prompt history tracking
- Configuration management
- Logging and debugging support

---

## Support

For issues and feature requests, please visit the [GitHub repository](https://github.com/augment-code/augment-agent-vscode).

**Enjoy coding with AI assistance!**
