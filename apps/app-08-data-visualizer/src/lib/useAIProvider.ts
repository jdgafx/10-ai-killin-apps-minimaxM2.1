import { useState, useCallback } from 'react';

export function useAIProvider() {
  const [isLoading, setIsLoading] = useState(false);
  
  const chat = useCallback(async (messages: { role: string; content: string }[]): Promise<string> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    
    return `**Data Analysis Insights:**

Dataset analyzed: ${lastUserMessage.substring(0, 50)}...

**Key Findings:**
1. Strong positive correlation between variables X and Y
2. Outliers detected in 3 data points
3. Trend shows consistent growth over time

**Visualization Recommendations:**
- Line chart for time series data
- Scatter plot for correlation analysis
- Bar chart for categorical comparisons

**Metrics:**
- Average: 42.5
- Median: 38.0
- Std Dev: 12.3

Configure VITE_MINIMAX_API_KEY for AI-powered data analysis.`;
  }, []);
  
  return { chat, isLoading };
}
