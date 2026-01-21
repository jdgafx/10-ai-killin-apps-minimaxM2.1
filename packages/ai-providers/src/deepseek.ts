/**
 * DeepSeek API Provider - Backup AI Provider
 */

import type { ChatMessage, ChatCompletion, StreamChunk } from './types';

const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';

export async function deepseekChat(
  messages: ChatMessage[],
  options: { model?: string; temperature?: number; maxTokens?: number } = {}
): Promise<ChatCompletion> {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DeepSeek API key not configured. Set VITE_DEEPSEEK_API_KEY in .env.local');

  const model = options.model || 'deepseek-chat';
  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
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
    model: data.model || model,
    choices: data.choices?.map((choice: any, index: number) => ({
      index,
      message: { role: choice.message?.role || 'assistant', content: choice.message?.content || '' },
      finish_reason: choice.finish_reason || 'stop',
    })) || [],
    usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
  };
}

export async function deepseekStreamChat(
  messages: ChatMessage[],
  onChunk: (chunk: StreamChunk) => void,
  options: { model?: string; temperature?: number; maxTokens?: number } = {}
): Promise<void> {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DeepSeek API key not configured');

  const model = options.model || 'deepseek-chat';
  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
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
            model: data.model || model,
            choices: [{ index: 0, delta: { role: 'assistant', content: data.choices?.[0]?.delta?.content || '' }, finish_reason: data.choices?.[0]?.finish_reason || null }],
          });
        } catch {}
      }
    }
  }
}

export async function deepseekCoder(messages: ChatMessage[], options: { temperature?: number; maxTokens?: number } = {}): Promise<ChatCompletion> {
  return deepseekChat(messages, { ...options, model: 'deepseek-coder' });
}
