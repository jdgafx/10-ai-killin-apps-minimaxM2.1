import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useAIProvider } from '@packages/ai-providers';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from '@packages/shared-ui';
import { 
  Code2, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info, 
  Copy, 
  RefreshCw,
  BarChart3,
  Zap,
  Settings
} from 'lucide-react';

interface Issue {
  line: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion?: string;
  code?: string;
}

interface ReviewResult {
  issues: Issue[];
  summary: {
    errors: number;
    warnings: number;
    info: number;
    score: number;
  };
  suggestions: string[];
}

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'ruby', name: 'Ruby' },
];

function App() {
  const [code, setCode] = useState(`// Paste your code here for AI review
function calculateSum(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum;
}`);

  const [language, setLanguage] = useState('javascript');
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const codeEndRef = useRef<HTMLDivElement>(null);

  const { chat, isLoading, error: aiError } = useAIProvider();

  const performCodeReview = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter some code to review');
      return;
    }

    setIsReviewing(true);
    setError(null);
    setReviewResult(null);

    try {
      const systemPrompt = `You are an expert code reviewer. Analyze the provided code and identify issues. 
Return your analysis as a JSON object with this exact structure:
{
  "issues": [
    {
      "line": <line number>,
      "severity": "error" | "warning" | "info",
      "message": "<issue description>",
      "suggestion": "<how to fix it>",
      "code": "<fixed code snippet>"
    }
  ],
  "summary": {
    "errors": <count>,
    "warnings": <count>,
    "info": <count>,
    "score": <1-100 code quality score>
  },
  "suggestions": ["<overall suggestion 1>", "<overall suggestion 2>"]
}

Focus on:
- Syntax errors and bugs
- Security vulnerabilities
- Performance issues
- Code style and best practices
- Type safety (where applicable)
- Error handling
- Code complexity`;

      const result = await chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Language: ${language}\n\nCode:\n${code}` },
      ]);

      // Try to parse the JSON response
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setReviewResult(parsed);
      } else {
        // Fallback: create a basic result from the text
        setReviewResult({
          issues: [],
          summary: { errors: 0, warnings: 0, info: 0, score: 85 },
          suggestions: [result],
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to review code');
    } finally {
      setIsReviewing(false);
    }
  }, [code, language, chat]);

  useEffect(() => {
    codeEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [code]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Code Reviewer</h1>
              <p className="text-sm text-gray-500">Automated code analysis and improvement suggestions</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
            <Button onClick={performCodeReview} loading={isReviewing} disabled={!code.trim()}>
              <Zap className="h-4 w-4 mr-2" />
              Review Code
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Input */}
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Code Input</h2>
              <span className="text-sm text-gray-500">{code.length} characters</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="flex-1 w-full p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              spellCheck={false}
            />
          </Card>

          {/* Review Results */}
          <Card className="h-[calc(100vh-200px)] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Review Results</h2>
              {reviewResult && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm text-gray-600">{reviewResult.summary.errors}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm text-gray-600">{reviewResult.summary.warnings}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-800">{reviewResult.summary.score}/100</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {isReviewing ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4">Analyzing your code...</p>
                </div>
              ) : reviewResult ? (
                <div className="space-y-4">
                  {/* Issues List */}
                  {reviewResult.issues.map((issue, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${getSeverityColor(issue.severity)}`}
                    >
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(issue.severity)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm bg-gray-200 px-2 py-0.5 rounded">
                              Line {issue.line}
                            </span>
                            <span className="text-sm font-medium capitalize text-gray-700">
                              {issue.severity}
                            </span>
                          </div>
                          <p className="text-gray-800">{issue.message}</p>
                          {issue.suggestion && (
                            <div className="mt-2 p-2 bg-white rounded border">
                              <p className="text-sm text-green-700 font-medium">Suggestion:</p>
                              <p className="text-sm text-gray-700">{issue.suggestion}</p>
                            </div>
                          )}
                          {issue.code && (
                            <button
                              onClick={() => copyToClipboard(issue.code!)}
                              className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                            >
                              <Copy className="h-4 w-4" />
                              Copy fix
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Overall Suggestions */}
                  {reviewResult.suggestions.length > 0 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Suggestions
                      </h3>
                      <ul className="space-y-1">
                        {reviewResult.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Code2 className="h-16 w-16 mb-4 opacity-50" />
                  <p>Paste your code and click "Review Code" to get started</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>

      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          Powered by MiniMax AI • {reviewResult?.summary.score || 0}/100 Code Quality Score
        </div>
      </footer>
    </div>
  );
}

export default App;
