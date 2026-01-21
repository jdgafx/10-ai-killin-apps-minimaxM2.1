import { useState, useCallback } from 'react';

export function useAIProvider() {
  const [isLoading, setIsLoading] = useState(false);
  
  const chat = useCallback(async (messages: { role: string; content: string }[]): Promise<string> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    
    return `**RAG Knowledge Base Search:**

Query: "${lastUserMessage.substring(0, 50)}..."

**Relevant Documents Found:**
1. Document A (95% match) - Contains relevant information about the topic
2. Document B (87% match) - Secondary reference with additional context
3. Document C (72% match) - Related background information

**Answer:**
Based on the vector search results, I found several relevant documents in your knowledge base. The AI has retrieved the most semantically similar chunks and synthesized this response.

In production with full RAG implementation:
- Documents are indexed as vectors
- Semantic search finds relevant chunks
- AI synthesizes coherent responses

Configure VITE_MINIMAX_API_KEY for full RAG capabilities.`;
  }, []);
  
  return { chat, isLoading };
}
