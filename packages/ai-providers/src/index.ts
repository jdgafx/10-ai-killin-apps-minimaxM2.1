/**
 * AI Providers Package
 * Unified interface for MiniMax, DeepSeek, and Gemini AI models
 */

export * from './minimax';
export * from './deepseek';
export * from './types';

// Unified types
export interface AIConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

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

export type ChatHandler = (chunk: StreamChunk) => void;

export type AIProvider = 'minimax' | 'deepseek' | 'gemini';

export class AIBridge {
  private provider: AIProvider;
  private config: AIConfig;

  constructor(provider: AIProvider = 'minimax') {
    this.provider = provider;
    this.config = this.getConfig(provider);
  }

  private getConfig(provider: AIProvider): AIConfig {
    const keyMap: Record<AIProvider, string> = {
      minimax: import.meta.env.VITE_MINIMAX_API_KEY || '',
      deepseek: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
      gemini: import.meta.env.VITE_GEMINI_API_KEY || '',
    };

    const configs: Record<AIProvider, AIConfig> = {
      minimax: {
        apiKey: keyMap.minimax,
        baseUrl: 'https://api.minimax.chat/v1',
        model: 'minimax-abab6.5',
        temperature: 0.7,
        maxTokens: 4096,
      },
      deepseek: {
        apiKey: keyMap.deepseek,
        baseUrl: 'https://api.deepseek.com',
        model: 'deepseek-chat',
        temperature: 0.7,
        maxTokens: 4096,
      },
      gemini: {
        apiKey: keyMap.gemini,
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        model: 'gemini-2.0-flash-exp',
        temperature: 0.7,
        maxTokens: 4096,
      },
    };
    return configs[provider];
  }

  async chat(messages: ChatMessage[]): Promise<ChatCompletion> {
    switch (this.provider) {
      case 'minimax': return this.chatWithMiniMax(messages);
      case 'deepseek': return this.chatWithDeepSeek(messages);
      case 'gemini': return this.chatWithGemini(messages);
      default: throw new Error(`Unknown provider: ${this.provider}`);
    }
  }

  async streamChat(messages: ChatMessage[], onChunk: ChatHandler): Promise<void> {
    switch (this.provider) {
      case 'minimax': return this.streamWithMiniMax(messages, onChunk);
      case 'deepseek': return this.streamWithDeepSeek(messages, onChunk);
      case 'gemini': return this.streamWithGemini(messages, onChunk);
      default: throw new Error(`Unknown provider: ${this.provider}`);
    }
  }

  private async chatWithMiniMax(messages: ChatMessage[]): Promise<ChatCompletion> {
    const response = await fetch(`${this.config.baseUrl}/text/chatcompletion_v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
        temperature: this.config.temperature,
        max_output_tokens: this.config.maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`MiniMax API Error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      id: data.id || crypto.randomUUID(),
      object: 'chat.completion',
      created: Date.now(),
      model: data.model || this.config.model || 'minimax',
      choices: data.choices?.map((choice: any, index: number) => ({
        index,
        message: { role: choice.message?.role || 'assistant', content: choice.message?.content || '' },
        finish_reason: choice.finish_reason || 'stop',
      })) || [],
      usage: {
        prompt_tokens: data.usage?.prompt_tokens || 0,
        completion_tokens: data.usage?.completion_tokens || 0,
        total_tokens: data.usage?.total_tokens || 0,
      },
    };
  }

  private async chatWithDeepSeek(messages: ChatMessage[]): Promise<ChatCompletion> {
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`DeepSeek API Error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      id: data.id || crypto.randomUUID(),
      object: 'chat.completion',
      created: data.created || Date.now(),
      model: data.model || this.config.model || 'deepseek-chat',
      choices: data.choices?.map((choice: any, index: number) => ({
        index,
        message: { role: choice.message?.role || 'assistant', content: choice.message?.content || '' },
        finish_reason: choice.finish_reason || 'stop',
      })) || [],
      usage: {
        prompt_tokens: data.usage?.prompt_tokens || 0,
        completion_tokens: data.usage?.completion_tokens || 0,
        total_tokens: data.usage?.total_tokens || 0,
      },
    };
  }

  private async chatWithGemini(messages: ChatMessage[]): Promise<ChatCompletion> {
    const contents = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(
      `${this.config.baseUrl}/models/${this.config.model}:generateContent?key=${this.config.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { temperature: this.config.temperature, maxOutputTokens: this.config.maxTokens },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Gemini API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      id: crypto.randomUUID(),
      object: 'chat.completion',
      created: Date.now(),
      model: this.config.model || 'gemini',
      choices: [{
        index: 0,
        message: { role: 'assistant', content: data.candidates?.[0]?.content?.parts?.[0]?.text || '' },
        finish_reason: 'stop',
      }],
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    };
  }

  private async streamWithMiniMax(messages: ChatMessage[], onChunk: ChatHandler): Promise<void> {
    const response = await fetch(`${this.config.baseUrl}/text/chatcompletion_v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
        temperature: this.config.temperature,
        max_output_tokens: this.config.maxTokens,
        stream: true,
      }),
    });

    if (!response.ok) throw new Error(`MiniMax Streaming Error: ${response.statusText}`);

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      for (const line of chunk.split('\n')) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            onChunk({
              id: data.id || crypto.randomUUID(),
              object: 'chat.completion.chunk',
              created: Date.now(),
              model: data.model || this.config.model || 'minimax',
              choices: [{ index: 0, delta: { role: 'assistant', content: data.choices?.[0]?.delta?.content || '' }, finish_reason: data.choices?.[0]?.finish_reason || null }],
            });
          } catch {}
        }
      }
    }
  }

  private async streamWithDeepSeek(messages: ChatMessage[], onChunk: ChatHandler): Promise<void> {
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
        stream: true,
      }),
    });

    if (!response.ok) throw new Error(`DeepSeek Streaming Error: ${response.statusText}`);

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      for (const line of chunk.split('\n')) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            onChunk({
              id: data.id || crypto.randomUUID(),
              object: 'chat.completion.chunk',
              created: data.created || Date.now(),
              model: data.model || this.config.model || 'deepseek-chat',
              choices: [{ index: 0, delta: { role: 'assistant', content: data.choices?.[0]?.delta?.content || '' }, finish_reason: data.choices?.[0]?.finish_reason || null }],
            });
          } catch {}
        }
      }
    }
  }

  private async streamWithGemini(messages: ChatMessage[], onChunk: ChatHandler): Promise<void> {
    const contents = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(
      `${this.config.baseUrl}/models/${this.config.model}:streamGenerateContent?key=${this.config.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { temperature: this.config.temperature, maxOutputTokens: this.config.maxTokens },
        }),
      }
    );

    if (!response.ok) throw new Error(`Gemini Streaming Error: ${response.statusText}`);

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      try {
        const data = JSON.parse(chunk);
        onChunk({
          id: crypto.randomUUID(),
          object: 'chat.completion.chunk',
          created: Date.now(),
          model: this.config.model || 'gemini',
          choices: [{ index: 0, delta: { role: 'assistant', content: data.candidates?.[0]?.content?.parts?.[0]?.text || '' }, finish_reason: null }],
        });
      } catch {}
    }
  }

  setProvider(provider: AIProvider) {
    this.provider = provider;
    this.config = this.getConfig(provider);
  }

  getProvider(): AIProvider {
    return this.provider;
  }
}

let aiBridge: AIBridge | null = null;

export function getAIBridge(provider: AIProvider = 'minimax'): AIBridge {
  if (!aiBridge || aiBridge.getProvider() !== provider) {
    aiBridge = new AIBridge(provider);
  }
  return aiBridge;
}

import { useState, useCallback, useEffect, useRef } from 'react';

export function useAIProvider(defaultProvider: AIProvider = 'minimax') {
  const [provider, setProviderState] = useState<AIProvider>(defaultProvider);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bridgeRef = useRef<AIBridge>(getAIBridge(provider));

  useEffect(() => { bridgeRef.current.setProvider(provider); }, [provider]);

  const chat = useCallback(async (messages: ChatMessage[]): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const completion = await bridgeRef.current.chat(messages);
      return completion.choices[0]?.message?.content || '';
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      if (provider === 'minimax') {
        try {
          bridgeRef.current.setProvider('deepseek');
          const fallbackCompletion = await bridgeRef.current.chat(messages);
          bridgeRef.current.setProvider('minimax');
          return fallbackCompletion.choices[0]?.message?.content || '';
        } catch {
          bridgeRef.current.setProvider('minimax');
          throw err;
        }
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  const streamChat = useCallback(async (messages: ChatMessage[], onToken: (token: string) => void): Promise<void> => {
    setIsLoading(true);
    setError(null);
    await bridgeRef.current.streamChat(messages, (chunk) => {
      const content = chunk.choices[0]?.delta?.content || '';
      onToken(content);
    });
    setIsLoading(false);
  }, [provider]);

  const setProvider = useCallback((newProvider: AIProvider) => { setProviderState(newProvider); }, []);

  return { provider, setProvider, chat, streamChat, isLoading, error };
}
