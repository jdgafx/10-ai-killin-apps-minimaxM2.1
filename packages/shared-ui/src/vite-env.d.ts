/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MINIMAX_API_KEY: string;
  readonly VITE_DEEPSEEK_API_KEY: string;
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_GEMINI_CLIENT_ID: string;
  readonly VITE_GITHUB_COPILOT_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
