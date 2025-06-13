# Running CLI with Docker

Use `cli.py` with Docker containers for isolated development on your projects.

**Important**: You must start your own Docker container - it's not automatic like SWE-bench mode.

## Prerequisites

Clone the repository, install Python dependencies, and set API keys:

```bash
# 1. Clone the repository
git clone -b output-json https://github.com/amorygalili/augment-swebench-agent.git
cd augment-swebench-agent

# 2. Create virtual environment
python -m venv .venv
source .venv/bin/activate # On Linux/Mac

# 3. Install requirements
pip install -r requirements.txt
pip install -e .

# 4. Set API keys
export ANTHROPIC_API_KEY="your_anthropic_api_key_here"
export OPENAI_API_KEY="your_openai_api_key_here"
```

## Quick Start

```bash
# 1. Start container with your project
docker run -it -d --name my-workspace -v "/your/project:/testbed" -w /testbed ubuntu:22.04 bash

# 2. Run the CLI
python cli.py --docker-container-id [CONTAINER_ID] --use-container-workspace /testbed --workspace /testbed
```

## Required Arguments

| Argument | Value |
|----------|-------|
| `--docker-container-id` | Your container ID |
| `--use-container-workspace` | `/testbed` |
| `--workspace` | `/testbed` |

## Common Container Types

```bash
# Python projects
docker run -it -d --name python-dev -v "/your/project:/testbed" python:3.11 bash

# Node.js projects
docker run -it -d --name node-dev -v "/your/project:/testbed" node:18 bash

# Basic Ubuntu
docker run -it -d --name basic-dev -v "/your/project:/testbed" ubuntu:22.04 bash
```

## Troubleshooting

**Container not found?**
```bash
docker ps  # Check if container is running
```

**Container exits immediately?**
```bash
# Use this instead
docker run -it -d --name my-workspace -v "/project:/testbed" ubuntu:22.04 tail -f /dev/null
```

**Permission errors?**
```bash
docker exec -u root -it $containerId chown -R 777:777 /testbed
```