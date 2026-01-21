import { useState, useCallback } from 'react';

export function useAIProvider() {
  const [isLoading, setIsLoading] = useState(false);
  
  const chat = useCallback(async (messages: { role: string; content: string }[]): Promise<string> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    
    return `Based on your message about "${lastUserMessage.substring(0, 50)}...", here's what I found:

This appears to be a document or query about a technical topic. In a production environment with proper API keys configured, I would search through your uploaded documents and provide relevant context.

**Simulated Response:**
The AI would analyze your query, search the vector index for relevant chunks, and return a coherent answer based on the document content.

To enable full functionality:
1. Configure VITE_MINIMAX_API_KEY
2. Configure VITE_DEEPSEEK_API_KEY  
3. Restart the dev server

Would you like me to explain how the document search works?`;
  }, []);
  
  return { chat, isLoading };
}
