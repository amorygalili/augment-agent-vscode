## Connect to LLM

### Can it connect to OpenAI models?
**Yes** - Has built-in OpenAI client (`OpenAIDirectClient`) that supports:
- Standard OpenAI models via first-party API
- Chain-of-thought models (o1 series) with special handling
- Configurable model names, retries, and temperature
- Tool calling support
- Requires `OPENAI_API_KEY` environment variable

### Can it connect to Anthropic models?
**Yes** - Has built-in Anthropic client (`AnthropicDirectClient`) that supports:
- Claude models via first-party API (defaults to claude-3-7-sonnet-20250219)
- Prompt caching for efficiency
- Thinking tokens support
- Tool calling support
- Configurable retries and low QoS server options
- Requires `ANTHROPIC_API_KEY` environment variable

### Can it connect to private LLMs?
**Limited** - The current implementation only supports OpenAI and Anthropic APIs. However, the architecture is extensible:
- Has abstract `LLMClient` base class that can be extended
- The `get_client()` function can be modified to support additional providers
- Would require implementing a new client class following the existing pattern

### Can it connect to local LLMs?
**No** - Currently only supports cloud-based APIs (OpenAI and Anthropic). No built-in support for local models like Ollama, vLLM, or other local inference servers.

## What tools does it have

### File operations?
**Yes** - Comprehensive file operations via `StrReplaceEditorTool`:
- **Read**: `view` command to display file contents with line numbers
- **Write**: `create` command to create new files
- **Edit**: `str_replace` command for precise string replacements with exact matching
- **Insert**: `insert` command to add content at specific line numbers
- **Undo**: `undo_edit` command to revert changes
- Smart indentation handling (can ignore indentation differences)
- Workspace-aware path resolution
- Permission handling and error reporting

### Shell access?
**Yes** - Full shell access via `BashTool`:
- Persistent bash shell using pexpect
- Command execution with output capture
- Configurable timeouts (default 60s)
- Command filtering and validation
- Banned commands list (prevents git operations by default)
- Docker container support for isolated execution
- User permission prompts for safety
- Working directory management

### Code analysis?
**Limited** - No dedicated code analysis tools, but can:
- Use bash commands like `grep`, `find`, `ls` for code exploration
- View file contents to understand code structure
- Execute tests to validate code behavior
- No built-in AST parsing, static analysis, or code metrics

### Code explanation?
**No** - No dedicated code explanation tools. The agent can read code and provide explanations through its LLM capabilities, but there are no specialized tools for code documentation or explanation generation.

### Code generation?
**Yes** - Through the LLM's natural capabilities combined with file operations:
- Can create new files with generated code
- Can modify existing code via string replacement
- Can generate test scripts and reproduction cases
- No specialized code generation templates or frameworks

### Interactive chat?
**Yes** - Full interactive chat capabilities:
- CLI interface with rich console output
- Command history support via prompt-toolkit
- Non-interactive mode for automated execution
- Conversation state management
- Resume capability for continuing sessions

### Connecting to other tools (MCP)?
**No** - No Model Context Protocol (MCP) support. The tool system is custom-built and doesn't integrate with MCP servers.

### Other tool integration?
**Limited** - Has some specialized integrations:
- **Docker**: Full Docker container support for isolated execution
- **Git**: Can generate patches and diffs (but prevents git commits)
- **Conda**: Environment management for Python projects
- **Testing**: Can execute test suites via bash commands
- No integration with IDEs, databases, APIs, or other external services

## Agent support

### Does it support agents?
**Yes** - Full agent architecture with:
- `Agent` class that orchestrates tool usage
- Multi-turn conversation support (up to 200 turns by default)
- Tool calling with single tool per turn limitation
- Automatic task completion detection
- Resume capability for continuing interrupted sessions
- System prompt customization
- Configurable token limits per turn (32,768 default)

### Do agents have access to all tools?
**Yes** - Agents have access to all implemented tools:
- **BashTool**: Shell command execution
- **StrReplaceEditorTool**: File operations
- **SequentialThinkingTool**: Step-by-step problem solving
- **CompleteTool**: Task completion signaling
- Tools are dynamically registered and available to the LLM
- Tool parameters are automatically validated against JSON schemas

### Do you get feedback from the agent so you can display things like:
**Yes** - Comprehensive feedback and logging:

- **Commands it's executing**:
  - All bash commands are logged before execution
  - Command outputs are captured and displayed
  - Permission prompts show commands before execution
  - Docker container commands are tracked

- **Code it's suggesting**:
  - File edit operations show old vs new content
  - String replacements display the exact changes
  - File creation shows full content being written
  - Undo operations show what was reverted

- **Code it's looking at**:
  - File view operations log what files are being examined
  - Line numbers and content ranges are shown
  - Directory listings show exploration patterns

- **History so you can checkpoints**:
  - Full conversation history maintained in `DialogMessages`
  - Token counting and budget management
  - Truncation strategy for long conversations
  - Tool call results are preserved
  - Resume functionality maintains state across sessions
  - Rich console output with colored formatting
  - Separate logging for agent activities vs user interaction

## Other features

### Does it use multiple LLMs for different tasks?
**Yes** - Multi-LLM architecture:
- **Primary agent**: Uses Claude Sonnet 3.7 by default for main reasoning and tool usage
- **Ensembler**: Uses OpenAI o1 models for selecting best solutions from multiple candidates
- **Configurable**: Can switch models via command line or configuration
- **Specialized roles**: Different models optimized for different tasks (reasoning vs selection)

### Multiple modal features?
**No** - Text-only interface:
- **Audio**: No audio input/output support
- **Video**: No video processing capabilities
- **Images**: No image analysis or generation
- Pure text-based interaction through CLI and file operations

### Can you set context (what files and directories to include/index)
**Partial** - Context management features:
- **Workspace-based**: Operates within a specified workspace directory
- **File-level**: Can view and edit specific files as needed
- **No indexing**: No automatic file indexing or embedding-based retrieval
- **Manual exploration**: Agent explores codebase through bash commands and file viewing
- **Docker isolation**: Can work within containerized environments

**What is included in each prompt?**
- **Full conversation history**: Entire dialog maintained until token limits
- **System prompt**: Includes workspace path and operating system info
- **Tool schemas**: All available tools and their parameters
- **File contents**: Only when explicitly viewed (not automatically included)
- **Token budgeting**: Automatic truncation when approaching limits (120K tokens)
- **Prompt caching**: Anthropic prompt caching for efficiency

### Can you have multiple chats?
**No** - Single conversation model:
- One active conversation per CLI session
- Can resume interrupted sessions
- No support for multiple parallel conversations
- No conversation branching or forking
- Each CLI invocation starts fresh unless resuming

### Does it have logging?
**Yes** - Comprehensive logging system:
- **Agent logs**: Separate logger for agent activities
- **Rich console**: Colored output with panels and formatting
- **File output**: Can redirect logs to files
- **Token tracking**: Input/output token counts and caching metrics
- **Error handling**: Detailed error logging and stack traces
- **Debug levels**: Configurable logging verbosity
- **Tool execution**: All tool calls and results logged

### Can you set preferences (temperature, etc.)
**Limited** - Some configuration options:
- **Temperature**: Hardcoded to 0.0 (not configurable via CLI)
- **Model selection**: Can choose between anthropic-direct and openai-direct clients
- **Token limits**: Configurable max tokens per turn and max turns
- **Timeouts**: Configurable command timeouts
- **Permissions**: Can enable/disable command approval prompts
- **Workspace**: Configurable working directory
- **Docker**: Optional container execution
- **Caching**: Can enable/disable prompt caching
- No user preference file or persistent settings

## How does it work

### Does it use a custom agent implementation?
**Yes** - Fully custom agent architecture:
- **Agent class**: Custom `Agent` class inheriting from `LLMTool`
- **Dialog management**: Custom `DialogMessages` class for conversation state
- **Tool orchestration**: Custom tool calling and result handling
- **Turn-based**: Alternating user/assistant turns with tool execution
- **State management**: Resume capability and conversation persistence
- **Token budgeting**: Automatic conversation truncation when limits approached
- **Based on Anthropic's approach**: Forked from Anthropic's SWE-bench blog post implementation

### Does it use a pre-trained agent?
**No** - Uses foundation models (Claude, GPT) with custom prompting:
- **Foundation models**: Leverages Claude Sonnet 3.7 and OpenAI models
- **Custom prompting**: Specialized system prompts for software engineering tasks
- **No fine-tuning**: No custom model training or fine-tuning
- **Prompt engineering**: Relies on carefully crafted prompts and tool descriptions
- **In-context learning**: Agent learns through examples and instructions in prompts

### Does it use a custom prompt?
**Yes** - Specialized prompts for software engineering:
- **System prompt**: Custom system prompt with workspace info and guidelines
- **Instruction prompt**: Detailed SWE-bench specific instructions with step-by-step guidance
- **Tool descriptions**: Custom tool descriptions and usage guidelines
- **Sequential thinking**: Specialized prompts for step-by-step problem solving
- **Ensembler prompts**: Custom prompts for solution selection and majority voting
- **Context-aware**: Prompts include workspace path and operating system information

### Does it use a custom tool system?
**Yes** - Fully custom tool architecture:
- **LLMTool base class**: Abstract base for all tools with standardized interface
- **JSON schema validation**: Automatic parameter validation using jsonschema
- **Tool registration**: Dynamic tool discovery and registration with LLM
- **Result handling**: Structured tool output with success/failure states
- **Dialog integration**: Tool results automatically added to conversation history
- **Error handling**: Comprehensive error catching and user-friendly messages
- **Permission system**: Optional user approval for dangerous operations

### Does it use a custom LLM client?
**Yes** - Custom client implementations:
- **Abstract base**: `LLMClient` base class with standardized interface
- **Multiple providers**: Separate clients for Anthropic and OpenAI APIs
- **Feature support**: Tool calling, system prompts, temperature, thinking tokens
- **Retry logic**: Built-in retry mechanisms with exponential backoff
- **Token tracking**: Detailed token usage monitoring and reporting
- **Caching**: Anthropic prompt caching integration
- **Error handling**: Provider-specific error handling and recovery
- **Extensible**: Easy to add new LLM providers

### Does it use a custom logger?
**Yes** - Multi-layered logging system:
- **Rich console**: Colored output with panels, progress bars, and formatting
- **Separate loggers**: Different loggers for agent activities vs user interaction
- **File output**: Optional log file output for debugging
- **Token metrics**: Detailed token usage and caching statistics
- **Tool execution**: All tool calls, parameters, and results logged
- **Error tracking**: Comprehensive error logging with stack traces
- **Configurable**: Different log levels and output formats
- **Integration**: Logging integrated throughout the entire system
