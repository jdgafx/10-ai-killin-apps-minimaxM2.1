# Auto-Claude Integration Guide

## Overview

Auto-Claude is an autonomous coding framework powered by Claude AI that builds software features through coordinated multi-agent sessions. It's fully installed and ready to use in this monorepo.

## Installation Status ✅

- ✅ **Python 3.13.11** installed (requires 3.10+)
- ✅ **Virtual environment** created at `auto-claude/venv/`
- ✅ **All dependencies installed** (claude-agent-sdk, graphiti-core, google-generativeai, etc.)
- ✅ **Claude CLI** available at `/usr/local/bin/claude`
- ✅ **Authentication configured** (uses Claude Code OAuth via system keychain)

## Quick Start

### 1. Navigate to Auto-Claude directory

```bash
cd auto-claude
source venv/bin/activate  # Activate Python environment
```

### 2. Run Auto-Claude

```bash
# Interactive mode - Create a new spec
python run.py

# List all existing specs
python run.py --list

# Run a specific spec
python run.py --spec 001

# Run in isolated workspace (git worktree)
python run.py --spec 001 --isolated

# Run directly in repo (no worktree)
python run.py --spec 001 --direct
```

## Integration with Monorepo

### Project Structure

```
10-ai-killin-apps-minimaxM2.1/
├── apps/              # 10 AI-powered React applications
├── packages/          # Shared packages (ai-providers, ui, utils)
├── auto-claude/       # Autonomous coding framework
│   ├── venv/         # Python virtual environment
│   ├── spec/         # Spec definitions and validation
│   ├── agents/       # AI agent execution
│   ├── run.py        # Main entry point
│   └── .env          # Configuration (OAuth token auto-detected)
└── AGENTS.md         # AI agent guidelines for the monorepo
```

### Workflow Recommendations

1. **For New Features**: Create specs in `auto-claude/` to define autonomous tasks
2. **For AI Apps**: Leverage Auto-Claude to build individual app features
3. **For Shared Packages**: Use Auto-Claude to enhance `ai-providers`, `shared-ui`, or `utils`

## Commands Reference

| Command | Description |
|---------|-------------|
| `python run.py` | Interactive mode - create new spec |
| `python run.py --list` | List all specs |
| `python run.py --spec 001` | Run spec 001 |
| `python run.py --spec 001 --isolated` | Run in isolated git worktree |
| `python run.py --spec 001 --direct` | Run directly in repo |
| `python run.py --spec 001 --merge` | Merge completed build |
| `python run.py --spec 001 --review` | Review build changes |
| `python run.py --spec 001 --discard` | Discard build |
| `python run.py --spec 001 --qa` | Run QA validation |
| `python run.py --list-worktrees` | List all worktrees |
| `python run.py --help` | Show all options |

## Environment Configuration

Auto-Claude uses `.env` for configuration. Authentication is handled automatically via:

- **macOS**: Keychain
- **Linux**: Secret Service (gnome-keyring/kwallet)
- **Windows**: Credential Manager

### Optional Environment Variables

```bash
# Override Claude model
AUTO_BUILD_MODEL=claude-3-7-sonnet-20250219

# Enable debug logging
DEBUG=true
DEBUG_LEVEL=2

# Linear integration (optional)
LINEAR_API_KEY=your-key-here

# Memory system (optional)
GRAPHITI_ENABLED=true
```

## Creating Specs

Specs define autonomous coding tasks. Auto-Claude follows a structured process:

1. **Discovery** - Analyze project structure
2. **Requirements** - Gather task requirements
3. **Context** - Discover relevant code context
4. **Planning** - Break down into subtasks
5. **Implementation** - Execute tasks with AI agents
6. **Validation** - Run tests and QA

### Spec Format

Specs are defined via `spec_contract.json` which outlines required outputs at each phase. See `auto-claude/spec_contract.json` for the complete schema.

## Advanced Features

### Git Worktrees

Auto-Claude can work in isolated git worktrees to avoid polluting your main branch:

```bash
python run.py --spec 001 --isolated
```

This creates a separate working directory while sharing the .git database.

### Memory Integration

Auto-Claude supports Graphiti memory system (LadybugDB) for persistent agent context:

```bash
# Enable in .env
GRAPHITI_ENABLED=true
```

Requires Python 3.12+ (currently using 3.13.11 ✅)

### Linear Integration

Connect Auto-Claude to Linear for issue tracking:

```bash
# Add to .env
LINEAR_API_KEY=your-key-here
```

## Troubleshooting

### "tree-sitter not available"
Safe to ignore - Auto-Claude falls back to regex parsing.

### Missing module errors
```bash
cd auto-claude
source venv/bin/activate
pip install -r requirements.txt
```

### Debug mode
```bash
export DEBUG=true
export DEBUG_LEVEL=2
python run.py --spec 001
```

### Authentication issues
```bash
# Re-authenticate with Claude
claude
# Type: /login
# Press Enter to open browser
```

## Next Steps

1. **Create your first spec**: Run `python run.py` and follow the interactive prompts
2. **Build an AI app feature**: Use Auto-Claude to implement a feature from the 10 AI apps
3. **Enhance shared packages**: Leverage autonomous agents to improve `ai-providers` or `shared-ui`

## Resources

- [Auto-Claude README](./auto-claude/README.md) - Detailed framework documentation
- [AGENTS.md](./AGENTS.md) - AI agent guidelines for this monorepo
- [Spec Contract](./auto-claude/spec_contract.json) - Spec definition schema

---

**Status**: ✅ **FULLY CONFIGURED AND READY TO USE**

Auto-Claude is installed, configured, and integrated with the monorepo. All dependencies are satisfied, authentication is configured, and the framework is operational.
