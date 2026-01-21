# AGENTS.md

This document provides guidelines for AI coding agents working in this repository.

## Build Commands

### Root Commands (Monorepo)
```bash
npm install          # Install all dependencies
npm run lint         # Lint all workspaces
npm run format       # Format all code with Prettier
```

### Per-Project Commands
Each app in `apps/*` follows this pattern:
```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production (outputs to dist/)
npm run lint         # Lint with ESLint
npm run preview      # Preview production build locally
```

### Running Single Tests
```bash
npm run test             # Run all tests
npm run test -- --run    # Run once (no watch mode)
npm run test -- filename # Run specific test file
```

## Code Style Guidelines

### Imports
- Use absolute imports with `@/` alias (configured via Vite)
- Group imports: React → third-party → internal → CSS/assets
- Alphabetize within groups
```javascript
import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import './Button.css'
```

### Types (TypeScript)
- Use TypeScript for all new files (.ts/.tsx)
- Explicit types for function parameters and return values
- Use interfaces for object shapes, types for unions/primitives
- No `any` type - use `unknown` and narrow appropriately
```typescript
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

type Provider = 'minimax' | 'gemini' | 'deepseek'

function sendMessage(content: string): Promise<ChatMessage>
```

### Naming Conventions
- **Components**: PascalCase (`ChatWindow`, `MessageBubble`)
- **Variables/functions**: camelCase (`isLoading`, `sendMessage`)
- **Constants**: UPPER_SNAKE_CASE or camelCase for config objects
- **Files**: kebab-case for non-components, PascalCase for components
- **React Hooks**: prefix with `use` (`useChat`, `useAIProvider`)

### Error Handling
- Never use empty catch blocks
- Use `try/catch` with proper error messages
- Return typed error states from hooks
```typescript
try {
  await sendMessage(text)
} catch (error) {
  console.error('Failed to send message:', error)
  setError(error instanceof Error ? error.message : 'Unknown error')
}
```

### React Patterns
- Functional components with hooks (no class components)
- Use `useCallback` for event handlers, `useMemo` for expensive computations
- PropTypes for .jsx files, TypeScript interfaces for .tsx
- Composition over inheritance for component reuse

### AI Provider Integration
- Use the unified `useAIProvider` hook for all AI calls
- Provider selection via dropdown, default to MiniMax
- Handle streaming responses for real-time feedback
- Implement fallback chain: MiniMax → DeepSeek → error state

### File Organization
```
src/
├── components/     # React components (PascalCase)
├── lib/           # Utilities, API clients (kebab-case)
├── hooks/         # Custom React hooks (useXxx)
├── pages/         # Route-level components
├── assets/        # Static assets
└── App.jsx        # Root component
```

### CSS/Styling
- Use Tailwind CSS for styling (per deployment guide)
- Utility classes over custom CSS
- Responsive design: `sm:`, `md:`, `lg:`, `xl:` breakpoints

### Git Commits
Follow Conventional Commits:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `chore:` maintenance
- `refactor:` code restructuring

## AI Provider Configuration

Keys are stored in `.env.local` (gitignored):
```bash
VITE_MINIMAX_API_KEY=...
VITE_DEEPSEEK_API_KEY=...
VITE_GITHUB_COPILOT_TOKEN=...
VITE_GEMINI_CLIENT_ID=...
```

## Deployment Targets

- **GitHub Pages**: `./dist` via GitHub Actions
- **Vercel**: Auto-detects Vite framework
- **Coolify**: Dockerfile in project root

## Monorepo Structure

```
apps/              # Individual AI portfolio projects
packages/          # Shared code (ui, utils, ai-providers)
config/            # ESLint, Prettier, Vite configs
.github/workflows/ # CI/CD pipelines
```
