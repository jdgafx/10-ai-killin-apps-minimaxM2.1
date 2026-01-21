import React, { useState, useCallback } from 'react';
import { useAIProvider } from '@packages/ai-providers';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from '@packages/shared-ui';
import { 
  Code2, 
  BookOpen, 
  Lightbulb, 
  Clock, 
  TrendingUp,
  Copy,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ExplanationSection {
  title: string;
  content: string;
  code?: string;
}

interface Explanation {
  overview: string;
  sections: ExplanationSection[];
  complexity: {
    time: string;
    space: string;
  };
  keyConcepts: string[];
  relatedTopics: string[];
}

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'go', name: 'Go' },
];

function App() {
  const [code, setCode] = useState(`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);`);

  const [language, setLanguage] = useState('javascript');
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0, 1]));

  const { chat, isLoading } = useAIProvider();

  const explainCode = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter some code to explain');
      return;
    }

    setIsExplaining(true);
    setError(null);
    setExplanation(null);

    try {
      const systemPrompt = `You are an expert code explainer. Analyze the provided code and return a JSON response with this exact structure:
{
  "overview": "<2-3 sentence summary>",
  "sections": [
    {
      "title": "<section name>",
      "content": "<detailed explanation>",
      "code": "<optional code snippet>"
    }
  ],
  "complexity": {
    "time": "<time complexity>",
    "space": "<space complexity>"
  },
  "keyConcepts": ["<concept 1>", "<concept 2>"],
  "relatedTopics": ["<topic 1>", "<topic 2>"]
}

Sections should include: "What it does", "How it works", "Line by line", "Key patterns".`;

      const result = await chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Language: ${language}\n\nCode:\n${code}` },
      ]);

      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setExplanation(parsed);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to explain code');
    } finally {
      setIsExplaining(false);
    }
  }, [code, language, chat]);

  const toggleSection = useCallback((index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Code Explainer</h1>
              <p className="text-sm text-gray-500">Understand any code instantly</p>
            </div>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
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
            <Button onClick={explainCode} loading={isExplaining} disabled={!code.trim()} className="mt-4">
              <Lightbulb className="h-4 w-4 mr-2" />
              Explain Code
            </Button>
          </Card>

          {/* Explanation */}
          <Card className="h-[calc(100vh-200px)] flex flex-col overflow-hidden">
            <h2 className="font-semibold text-gray-800 mb-4">Explanation</h2>
            <div className="flex-1 overflow-y-auto">
              {isExplaining ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4">Analyzing code...</p>
                </div>
              ) : explanation ? (
                <div className="space-y-4">
                  {/* Overview */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-800 mb-2">Overview</h3>
                    <p className="text-gray-700">{explanation.overview}</p>
                  </div>

                  {/* Complexity */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-green-600" />
                        <h3 className="font-medium text-green-800">Time Complexity</h3>
                      </div>
                      <p className="text-gray-700 font-mono">{explanation.complexity.time}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        <h3 className="font-medium text-purple-800">Space Complexity</h3>
                      </div>
                      <p className="text-gray-700 font-mono">{explanation.complexity.space}</p>
                    </div>
                  </div>

                  {/* Sections */}
                  {explanation.sections.map((section, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(index)}
                        className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-medium text-gray-800">{section.title}</span>
                        {expandedSections.has(index) ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      {expandedSections.has(index) && (
                        <div className="p-4">
                          <p className="text-gray-700 mb-3">{section.content}</p>
                          {section.code && (
                            <div className="relative">
                              <pre className="p-3 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto">
                                <code>{section.code}</code>
                              </pre>
                              <button
                                onClick={() => copyToClipboard(section.code!)}
                                className="absolute top-2 right-2 p-1 bg-white/10 rounded hover:bg-white/20 transition-colors"
                              >
                                <Copy className="h-4 w-4 text-white" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Key Concepts */}
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h3 className="font-medium text-yellow-800 mb-2">Key Concepts</h3>
                    <div className="flex flex-wrap gap-2">
                      {explanation.keyConcepts.map((concept, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-sm"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Code2 className="h-16 w-16 mb-4 opacity-50" />
                  <p>Paste your code and click "Explain Code" to get started</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default App;
