# 🚀 10 AI Portfolio Apps

A collection of 10 AI-powered applications built with React, TypeScript, and Vite.

## 🚀 Live Demo URLs

| App                | URL                                  |
| ------------------ | ------------------------------------ |
| AI Code Reviewer   | https://ai-code-reviewer.pages.dev   |
| Document Chat      | https://document-chat.pages.dev      |
| Image Generator    | https://image-generator.pages.dev    |
| Voice Assistant    | https://voice-assistant.pages.dev    |
| Code Explainer     | https://code-explainer.pages.dev     |
| Test Generator     | https://test-generator.pages.dev     |
| API Integrator     | https://api-integrator.pages.dev     |
| Data Visualizer    | https://data-visualizer.pages.dev    |
| Autonomous Agent   | https://autonomous-agent.pages.dev   |
| RAG Knowledge Base | https://rag-knowledge-base.pages.dev |

Auto-deploy enabled via GitHub Actions → Cloudflare Pages

## 📱 Applications

1. **AI Code Reviewer** - Intelligent code analysis and suggestions
2. **Document Chat** - AI-powered document Q&A system
3. **Image Generator** - Create images with AI
4. **Voice Assistant** - Speech-enabled AI interactions
5. **Code Explainer** - Understand complex codebases
6. **Test Generator** - Automated test creation
7. **API Integrator** - Connect to various AI APIs
8. **Data Visualizer** - Transform data into insights
9. **Autonomous Agent** - Self-directed AI assistant
10. **RAG Knowledge Base** - Retrieval-augmented generation system

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: @tanstack/react-query
- **AI Providers**: MiniMax, DeepSeek, Gemini

## 📦 Installation

```bash
# Install all dependencies
npm install

# Install root dependencies
npm install
```

## 🏃 Development

```bash
# Start development server (port 3000)
npm run dev

# Start specific app
cd apps/app-01-ai-code-reviewer
npm run dev
```

## 🔨 Build

```bash
# Build all apps
npm run build

# Build specific app
cd apps/app-01-ai-code-reviewer
npm run build
```

## 📁 Project Structure

```
apps/
├── app-01-ai-code-reviewer/    # AI Code Reviewer
├── app-02-document-chat/       # Document Chat
├── app-03-image-generator/     # Image Generator
├── app-04-voice-assistant/     # Voice Assistant
├── app-05-code-explainer/      # Code Explainer
├── app-06-test-generator/      # Test Generator
├── app-07-api-integrator/      # API Integrator
├── app-08-data-visualizer/     # Data Visualizer
├── app-09-autonomous-agent/    # Autonomous Agent
└── app-10-rag-knowledge-base/  # RAG Knowledge Base

packages/                       # Shared packages
├── ai-providers/              # AI integration layer
├── shared-ui/                 # Shared UI components
└── utils/                     # Shared utilities

config/                        # Configuration files
├── eslint/
├── prettier/
└── vite/
```

## 🔑 Environment Variables

Create `.env.local` in the project root:

```bash
VITE_MINIMAX_API_KEY=your-minimax-key
VITE_DEEPSEEK_API_KEY=your-deepseek-key
VITE_GEMINI_API_KEY=your-gemini-key
```

## 🎨 Code Standards

- **Imports**: Use `@/` alias for absolute imports (configured via Vite)
- **Types**: TypeScript with explicit types (no `any`)
- **Styling**: Tailwind CSS only (no custom CSS)
- **Components**: shadcn/ui as primary component library
- **Error Handling**: Proper error states and user feedback

## 📚 Documentation

- [AGENTS.md](./AGENTS.md) - Coding standards for AI agents
- [AUTO_CLAUDE_QUICK_START.md](./AUTO_CLAUDE_QUICK_START.md) - Auto-Claude setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ using React, TypeScript, and AI**
