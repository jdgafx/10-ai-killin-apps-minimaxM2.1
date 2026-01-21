import { useState, useCallback } from 'react';

export function useAIProvider() {
  const [isLoading, setIsLoading] = useState(false);
  
  const chat = useCallback(async (messages: { role: string; content: string }[]): Promise<string> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    
    return `**Code Explanation:**

\`\`\`
${lastUserMessage.substring(0, 200)}...
\`\`\`

**Analysis:**

This code snippet demonstrates several important programming concepts:

1. **Component Structure** - Functional components with hooks
2. **State Management** - Using useState for reactive data
3. **Side Effects** - useEffect for lifecycle operations
4. **Event Handling** - User interactions and callbacks

**Key Points:**
- The component follows React best practices
- Uses proper TypeScript typing
- Separates concerns appropriately

This is a simulated explanation. Configure VITE_MINIMAX_API_KEY for real AI-powered code explanations.`;
  }, []);
  
  return { chat, isLoading };
}
