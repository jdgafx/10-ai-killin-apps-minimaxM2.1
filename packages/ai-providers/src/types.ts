export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletion {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface StreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    delta: Partial<ChatMessage>;
    finish_reason: string | null;
  }[];
}

export type AIProvider = 'minimax' | 'deepseek' | 'gemini';

export interface AIConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}
