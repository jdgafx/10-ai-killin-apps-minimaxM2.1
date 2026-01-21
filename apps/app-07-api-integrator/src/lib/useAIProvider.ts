import { useState, useCallback } from 'react';

export function useAIProvider() {
  const [isLoading, setIsLoading] = useState(false);
  
  const chat = useCallback(async (messages: { role: string; content: string }[]): Promise<string> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    
    return `**API Integration Analysis:**

Endpoint: \`${lastUserMessage.substring(0, 100)}...\`

**Recommended Implementation:**

\`\`\`typescript
async function fetchData<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  return response.json();
}
\`\`\`

**Best Practices:**
1. Always handle errors gracefully
2. Use TypeScript generics for type safety
3. Implement retry logic for resilience
4. Cache responses when appropriate

Configure VITE_MINIMAX_API_KEY for real API integrations.`;
  }, []);
  
  return { chat, isLoading };
}

export function useAPI() {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const fetchData = useCallback(async (url: string, options?: RequestInit): Promise<unknown> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { data, error, loading, fetchData };
}
