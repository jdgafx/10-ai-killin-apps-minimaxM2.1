/**
 * MiniMax API Provider - Primary AI Provider
 */

import type { ChatMessage, ChatCompletion, StreamChunk } from './types';

const MINIMAX_BASE_URL = 'https://api.minimax.chat/v1';

export async function minimaxChat(
  messages: ChatMessage[],
  options: { model?: string; temperature?: number; maxTokens?: number } = {}
): Promise<ChatCompletion> {
  const apiKey = import.meta.env.VITE_MINIMAX_API_KEY;
  if (!apiKey) throw new Error('MiniMax API key not configured. Set VITE_MINIMAX_API_KEY in .env.local');

  const model = options.model || 'minimax-abab6.5';
  const response = await fetch(`${MINIMAX_BASE_URL}/text/chatcompletion_v2`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
      temperature: options.temperature ?? 0.7,
      max_output_tokens: options.maxTokens ?? 4096,
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
    model: data.model || model,
    choices: data.choices?.map((choice: any, index: number) => ({
      index,
      message: { role: choice.message?.role || 'assistant', content: choice.message?.content || '' },
      finish_reason: choice.finish_reason || 'stop',
    })) || [],
    usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
  };
}

export async function minimaxStreamChat(
  messages: ChatMessage[],
  onChunk: (chunk: StreamChunk) => void,
  options: { model?: string; temperature?: number; maxTokens?: number } = {}
): Promise<void> {
  const apiKey = import.meta.env.VITE_MINIMAX_API_KEY;
  if (!apiKey) throw new Error('MiniMax API key not configured');

  const model = options.model || 'minimax-abab6.5';
  const response = await fetch(`${MINIMAX_BASE_URL}/text/chatcompletion_v2`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
      temperature: options.temperature ?? 0.7,
      max_output_tokens: options.maxTokens ?? 4096,
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
            model: data.model || model,
            choices: [{ index: 0, delta: { role: 'assistant', content: data.choices?.[0]?.delta?.content || '' }, finish_reason: data.choices?.[0]?.finish_reason || null }],
          });
        } catch {}
      }
    }
  }
}

export async function minimaxEmbeddings(texts: string[]): Promise<number[][]> {
  const apiKey = import.meta.env.VITE_MINIMAX_API_KEY;
  if (!apiKey) throw new Error('MiniMax API key not configured');

  const response = await fetch(`${MINIMAX_BASE_URL}/text/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'minimax-emb', texts }),
  });

  if (!response.ok) throw new Error(`MiniMax Embeddings Error: ${response.statusText}`);
  const data = await response.json();
  return data.embeddings || [];
}

export async function minimaxTextToImage(prompt: string, options: { aspectRatio?: string; n?: number } = {}): Promise<string[]> {
  const apiKey = import.meta.env.VITE_MINIMAX_API_KEY;
  if (!apiKey) throw new Error('MiniMax API key not configured');

  const response = await fetch(`${MINIMAX_BASE_URL}/image/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'image-01', prompt, aspect_ratio: options.aspectRatio || '1:1', n: options.n || 1 }),
  });

  if (!response.ok) throw new Error(`MiniMax Image Generation Error: ${response.statusText}`);
  const data = await response.json();
  return data.images || [];
}
