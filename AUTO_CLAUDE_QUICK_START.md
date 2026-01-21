# Auto-Claude Quick Start Guide

## Current Status: Ready to Run (One Manual Step Required)

Auto-Claude is **fully installed** and configured. The ULTRAWORK spec is ready to execute.

### Why Authentication is Needed

The current Claude Code session you're using has authentication built-in, but Auto-Claude's Python backend requires **explicit OAuth token configuration** via system keychain for security reasons.

---

## OPTION 1: Interactive OAuth Login (Recommended)

### Step 1: Run Interactive Login

```bash
# This opens your browser for OAuth authentication
claude

# When Claude Code CLI opens, type:
/login

# Press Enter, complete browser OAuth flow
# Token will be saved to Linux Secret Service automatically
```

### Step 2: Run Auto-Claude

```bash
cd /home/chris/dev/10-ai-killin-apps-minimaxM2.1
source auto-claude/venv/bin/activate
python auto-claude/run.py --spec 001 --direct --auto-continue
```

---

## OPTION 2: Use Existing Session Token (Advanced)

If you have access to a plaintext Claude OAuth token from another source:

```bash
cd /home/chris/dev/10-ai-killin-apps-minimaxM2.1
nano auto-claude/.env

# Add (uncomment and paste your actual token):
CLAUDE_CODE_OAUTH_TOKEN=sk-ant-oat01-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Then run:
```bash
source auto-claude/venv/bin/activate
python auto-claude/run.py --spec 001 --direct --auto-continue
```

---

## What Happens When You Run

Once authenticated, Auto-Claude will **autonomously**:

1. **Analyze all 10 AI portfolio apps** in `apps/` directory:
   - ai-code-reviewer, document-chat, image-generator, voice-assistant
   - code-explainer, test-generator, api-integrator, data-visualizer
   - autonomous-agent, rag-knowledge-base

2. **Verify monorepo patterns** from `AGENTS.md`:
   - Check `@/` alias imports
   - Verify Tailwind CSS usage (no custom CSS)
   - Ensure shadcn/ui components
   - Validate TypeScript types (no `any`)

3. **Audit AI integrations**:
   - Verify `useAIProvider` hook usage from `@repo/ai-providers`
   - Check MiniMax, DeepSeek, Gemini configurations
   - Ensure consistent AI provider patterns

4. **Fix issues found**:
   - TypeScript errors
   - Build failures
   - Missing imports
   - Inconsistent styling

5. **Generate comprehensive report** with **PROOF**:
   - Build outputs (exit code 0)
   - lsp_diagnostics results (no errors)
   - Test results (all passing)
   - Evidence for every claim made

---

## ULTRAWORK Mode (Already Embedded in Spec)

The ULTRAWORK requirements are **embedded directly** in `.auto-claude/specs/001-ultrawork:-enhance-10-ai-portfolio-apps/spec.md`:

```
CRITICAL: YOU MUST OPERATE IN ULTRAWORK MODE AT ALL TIMES.

- Track EVERY step with TODO items
- Mark complete IMMEDIATELY after each step
- Fire independent agents simultaneously via background_task
- NEVER wait sequentially for agent responses
- VERIFY everything - NOTHING is done without PROOF it works
- Zero scope reduction - deliver 100% implementation
- NO test deletion - fix code, not tests
- NEVER STOP until task is 100% complete
```

When the autonomous agent reads the spec, it will operate with these strict disciplines.

---

## Monitoring Progress

```bash
# Check current status
python auto-claude/run.py --list

# Review what was built
python auto-claude/run.py --spec 001 --review

# Check QA status
python auto-claude/run.py --spec 001 --qa-status
```

---

## Project Context

**Tech Stack:**
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- Monorepo: npm workspaces
- AI Providers: MiniMax (primary), DeepSeek, Gemini
- Auto-Claude: Python 3.13.11, Claude Agent SDK 0.1.20

**Important Standards** (from `AGENTS.md`):
- Imports: Use `@/` alias for absolute imports
- Styling: Tailwind CSS only, no custom CSS
- Components: shadcn/ui as primary component library
- Types: TypeScript with explicit types, no `any`
- AI: Unified `useAIProvider` hook from `@repo/ai-providers`

---

## Why Can't We Extract the Current Session Token?

The current Claude Code session you're running has authentication, but **it's managed internally by the Claude Code CLI** for security reasons. The token is not exposed to:
- Environment variables
- Configuration files
- Subprocess access

This is intentional security design. Auto-Claude's Python backend needs **explicit authentication** via:
- System keychain (via `claude setup-token` command)
- Manual token configuration in `.env`

---

## Known Issues (Documented)

From `auto-claude/INVESTIGATION.md`:
- Encrypted tokens with `enc:` prefix are NOT supported in environment variables
- Users must use plaintext tokens or system keychain storage
- The Claude Agent SDK handles keychain tokens automatically (if properly configured)

---

## You're One Command Away from Autonomous Execution

**Recommended**: Run `claude` and type `/login` to authenticate via browser OAuth.

After authentication, run:
```bash
cd /home/chris/dev/10-ai-killin-apps-minimaxM2.1
source auto-claude/venv/bin/activate
python auto-claude/run.py --spec 001 --direct --auto-continue
```

Auto-Claude will execute autonomously with ULTRAWORK discipline embedded in the spec.
