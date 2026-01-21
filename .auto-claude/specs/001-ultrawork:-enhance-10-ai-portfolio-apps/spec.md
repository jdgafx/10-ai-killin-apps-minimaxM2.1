# ULTRAWORK: Enhance 10 AI Portfolio Apps

## Overview

**CRITICAL: YOU MUST OPERATE IN ULTRAWORK MODE AT ALL TIMES.**

## ULTRAWORK MODE REQUIREMENTS

- **Track EVERY step with TODO items**
- **Mark complete IMMEDIATELY after each step**
- **Fire independent agents simultaneously via background_task**
- **NEVER wait sequentially for agent responses**
- **VERIFY everything - NOTHING is done without PROOF it works**
- **Zero scope reduction - deliver 100% implementation**
- **NO test deletion - fix code, not tests**
- **NEVER STOP until task is 100% complete**

## Task Description

Analyze and enhance the 10 AI portfolio applications in the `apps/` directory.

### Objectives

1. **Verify Monorepo Patterns**: Ensure all apps follow the patterns defined in `AGENTS.md`
2. **AI Integration Audit**: Verify all AI integrations are properly configured via `@repo/ai-providers`
3. **UI Consistency**: Ensure Tailwind CSS and shadcn/ui are used consistently across all apps
4. **Code Quality**: Check for TypeScript errors, missing imports, and code smells
5. **Build Verification**: Ensure all apps build successfully

### Deliverables

- [ ] Complete analysis report of all 10 apps
- [ ] Fix any TypeScript errors or build issues
- [ ] Standardize AI provider usage across apps
- [ ] Ensure UI consistency (Tailwind + shadcn/ui)
- [ ] Update documentation as needed

## Technical Context

### Project Structure

```
apps/
├── ai-code-reviewer/
├── document-chat/
├── image-generator/
├── voice-assistant/
├── code-explainer/
├── test-generator/
├── api-integrator/
├── data-visualizer/
├── autonomous-agent/
└── rag-knowledge-base/

packages/
├── ai-providers/    # Shared AI integration layer
├── shared-ui/       # Shared UI components
└── utils/           # Shared utilities
```

### Standards (from AGENTS.md)

- **Imports**: Use `@/` alias for absolute imports
- **Styling**: Tailwind CSS only, no custom CSS
- **Components**: shadcn/ui as primary component library
- **Types**: TypeScript with explicit types, no `any`
- **AI**: Unified `useAIProvider` hook from `@repo/ai-providers`

## Implementation Plan

### Phase 1: Discovery (TODO items 1-3)
1. Scan all 10 apps for file structure and dependencies
2. Identify apps with build errors or missing configs
3. Document current AI provider usage patterns

### Phase 2: Standardization (TODO items 4-7)
4. Fix TypeScript errors across all apps
5. Standardize AI provider integration
6. Ensure Tailwind/shadcn/ui consistency
7. Update imports to use `@/` alias

### Phase 3: Verification (TODO items 8-10)
8. Run build on all apps
9. Run linter on all apps
10. Generate final report with evidence

## Success Criteria

- ✅ All 10 apps build without errors
- ✅ All apps use `useAIProvider` hook from shared package
- ✅ Consistent Tailwind CSS + shadcn/ui usage
- ✅ No TypeScript `any` types
- ✅ All imports use `@/` alias
- ✅ Evidence provided for all claims (build outputs, test results)

## Notes for Implementation

**ULTRAWORK DISCIPLINE REQUIRED**:
- Create TODO items BEFORE starting work
- Mark completed IMMEDIATELY after each step
- Run lsp_diagnostics on changed files
- Provide PROOF for all claims (command outputs, test results)
- NO SCOPE REDUCTION - implement 100%
