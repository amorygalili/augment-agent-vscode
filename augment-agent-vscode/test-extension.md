# Testing the Coding Agent VSCode Extension

## Manual Testing Steps

### 1. Launch Extension Development Host

1. Open the `vscode-extension/augment-agent` folder in VSCode
2. Press `F5` to launch a new Extension Development Host window
3. The extension should activate automatically

### 2. Verify Extension Activation

1. Check that the robot icon appears in the activity bar (left sidebar)
2. Click the robot icon to open the Coding Agent sidebar
3. Verify you see two sections:
   - "Agent Chat" (webview)
   - "Prompt History" (tree view)

### 3. Test Configuration

1. Open VSCode settings (Ctrl+,)
2. Search for "augment-agent"
3. Verify all configuration options are available:
   - Agent Path
   - Python Path
   - OpenAI API Key
   - Anthropic API Key
   - Ask Permission
   - Max Turns
   - Enable Logging

### 4. Test Chat Interface

1. Click on the "Agent Chat" section
2. Verify the welcome message appears
3. Try typing a message in the input field
4. Note: Without proper agent configuration, you'll get an error (expected)

### 5. Test Commands

1. Open Command Palette (Ctrl+Shift+P)
2. Search for "Augment Agent" commands:
   - "Open Augment Agent Chat"
   - "Clear Chat History"
   - "Show Agent Logs"

### 6. Test with Real Agent (Optional)

If you have augment-swebench-agent set up:

1. Configure the agent path in settings
2. Set your API keys
3. Try sending a simple message like "Hello"
4. Verify the agent responds

## Expected Behavior

- Extension loads without errors
- UI elements appear correctly
- Configuration options are accessible
- Commands are registered and functional
- Chat interface is responsive

## Common Issues

1. **Extension doesn't activate**: Check the console for errors
2. **UI doesn't appear**: Verify package.json contributions are correct
3. **Agent doesn't respond**: Check agent path and API key configuration
4. **Build errors**: Run `npm run compile` to check for TypeScript errors

## Development Notes

- The extension uses esbuild for bundling
- TypeScript compilation is separate from bundling
- Media files (CSS/JS) are served from the `media/` directory
- All agent communication goes through the `AgentService` class
