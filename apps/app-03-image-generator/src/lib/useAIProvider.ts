import { useState, useCallback } from 'react';

export function useAIProvider() {
  const [isLoading, setIsLoading] = useState(false);
  
  const chat = useCallback(async (messages: { role: string; content: string }[]): Promise<string> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    
    // Return image generation prompt (in production, this would call the API)
    return `**Image Generation Prompt Generated:**

"${lastUserMessage}"

This is a simulated response. In production with MiniMax API configured, this would generate an actual image based on your prompt.

To enable image generation:
1. Set VITE_MINIMAX_API_KEY
2. Configure the image generation endpoint
3. The AI will create images matching your description`;
  }, []);
  
  return { chat, isLoading };
}

export function generateImage(prompt: string): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => {
      // Return a placeholder image URL
      resolve(`https://picsum.photos/seed/${encodeURIComponent(prompt)}/800/600`);
    }, 2000);
  });
}
