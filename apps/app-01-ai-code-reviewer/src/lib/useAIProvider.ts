import { useState, useCallback } from 'react';

export function useAIProvider() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chat = useCallback(async (messages: { role: string; content: string }[]): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    
    if (lastUserMessage.includes('review')) {
      return `I've analyzed your code and found several improvements:

**Issues Found:**
1. Missing error handling for async operations
2. Consider using TypeScript interfaces for better type safety
3. Extract reusable logic into custom hooks

**Suggested Refactor:**
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
}

**Score: 8.5/10** - Good structure, minor improvements needed.`;
    }
    
    if (lastUserMessage.includes('explain')) {
      return `This code demonstrates **React Hooks** pattern with several key concepts:

1. **useState**: Manages local component state
2. **useCallback**: Memoizes functions to prevent unnecessary re-renders
3. **useEffect**: Handles side effects and lifecycle

The component follows the "Presentational vs Container" pattern, separating logic from UI.`;
    }
    
    if (lastUserMessage.includes('test')) {
      return `Here's a comprehensive test suite for your component:

import { render, screen, fireEvent } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  it('renders without crashing', () => {
    render(<Component />);
  });
  
  it('handles user interaction', () => {
    render(<Component />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});`;
    }
    
    return `I understand you're asking about "${lastUserMessage.substring(0, 50)}...".

This is a simulated response since the AI provider requires API keys to be configured. In a production environment, this would connect to MiniMax, DeepSeek, or Gemini for real AI responses.

To enable real AI features:
1. Set VITE_MINIMAX_API_KEY in your environment
2. Set VITE_DEEPSEEK_API_KEY for fallback
3. Restart the development server

Is there anything specific about your code you'd like me to help with?`;
  }, []);
  
  return { chat, isLoading, error };
}
