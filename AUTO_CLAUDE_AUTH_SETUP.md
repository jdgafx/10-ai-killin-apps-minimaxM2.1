# Auto-Claude Authentication Setup

## Current Status

Auto-Claude is **fully installed and configured** with one final step required: **OAuth token setup**.

## Why Authentication is Needed

Auto-Claude uses the Claude Agent SDK which requires OAuth authentication to make API calls. Unlike the Claude Code terminal you're using now (which has authentication built-in), the Python backend needs explicit token configuration.

## One-Time Setup (Required)

Run this command **once** to set up your authentication token:

```bash
claude setup-token
```

This will:
1. Open your browser for authentication
2. Save the token securely to your system keychain (macOS Keychain, Linux Secret Service, or Windows Credential Manager)
3. Make the token available to Auto-Claude automatically

## Verification

After running `claude setup-token`, verify it worked:

```bash
# This should show your token source
cd /home/chris/dev/10-ai-killin-apps-minimaxM2.1
source auto-claude/venv/bin/activate
python auto-claude/run.py --spec 001 --direct
```

You should see:
```
Auth: Keychain (macOS) / Secret Service (Linux) / Credential Manager (Windows)
```

## Running Auto-Claude with ULTRAWORK

Once authentication is set up:

```bash
cd /home/chris/dev/10-ai-killin-apps-minimaxM2.1
source auto-claude/venv/bin/activate

# Run the ULTRAWORK spec
python auto-claude/run.py --spec 001 --direct --auto-continue

# This will:
# - Analyze all 10 AI portfolio apps
# - Fix TypeScript errors and build issues
# - Verify AI provider integration
# - Ensure UI consistency (Tailwind + shadcn/ui)
# - Operate in ULTRAWORK mode (maximum precision, comprehensive TODOs)
```

## Alternative: Manual Token Configuration

If `claude setup-token` doesn't work, you can manually set the token in `.env`:

```bash
cd auto-claude
nano .env

# Add this line (replace with your actual token):
CLAUDE_CODE_OAUTH_TOKEN=sk-ant-oat01-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**WARNING**: The INVESTIGATION.md file in the auto-claude directory documents a known issue with encrypted tokens (tokens with `enc:` prefix). If you encounter a 401 error, the token may need decryption. This is a known Auto-Claude limitation being investigated.

## Quick Reference

| Command | Purpose |
|---------|---------|
| `claude setup-token` | One-time authentication setup |
| `python auto-claude/run.py --list` | List all specs |
| `python auto-claude/run.py --spec 001` | Run ULTRAWORK spec 001 |
| `python auto-claude/run.py --spec 001 --review` | Review what was built |
| `python auto-claude/run.py --help` | See all commands |

## What Happens Next

Once authenticated, Auto-Claude will:

1. **Execute spec 001** autonomously
2. **Operate in ULTRAWORK mode** (embedded in spec.md)
3. **Track every step** with TODO items
4. **Verify all changes** with proof (lsp_diagnostics, build outputs)
5. **Deliver 100%** implementation (no scope reduction)
6. **Generate comprehensive report** with evidence

The ULTRAWORK requirements are embedded directly in the spec file at:
`.auto-claude/specs/001-ultrawork:-enhance-10-ai-portfolio-apps/spec.md`

---

**You're one command away from autonomous ULTRAWORK execution**: `claude setup-token`
