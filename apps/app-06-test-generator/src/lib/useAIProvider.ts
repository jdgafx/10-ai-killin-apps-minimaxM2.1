import { useState, useCallback } from 'react';

export function useAIProvider() {
  const [isLoading, setIsLoading] = useState(false);
  
  const chat = useCallback(async (messages: { role: string; content: string }[]): Promise<string> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    
    return `**Generated Tests:**

\`\`\`typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

describe('Component Tests', () => {
  it('should render without crashing', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    const handleClick = vi.fn();
    render(<YourComponent onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should display correct state', () => {
    render(<YourComponent initialCount={0} />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });
});
\`\`\`

This is simulated. Configure VITE_MINIMAX_API_KEY for AI-powered test generation.`;
  }, []);
  
  return { chat, isLoading };
}
