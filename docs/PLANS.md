## Manually run Augment on SWE-bench

### Run in a windows environment

- [] Use a python virtual environment and docker to run
- [] Add some basic tests (manual or automated) to verify support for features

### Basic VSCode extension interface

- [] Integrate with augment-swebench-agent
- [] Add an icon to open up a view in the sidebar
- [] View should contain an area for having a conversation between the user and the LLM/agent
- [] In the future there will be two types of conversation, chat and agent. For now this view should just implement agent support.
- [] LLMs often give back markdown so the chat view should have markdown support
- [] Settings for providing an API key for OpenAI and Anthropic models

### Logging and Debugging

- [] Extension should provide logging which goes to the VSCode Output view
- [] A view should be added to the extension sidebar showing a history of the raw prompts sent to LLMs and replies from the LLMs