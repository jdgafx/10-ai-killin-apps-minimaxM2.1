import React, { useState, useCallback } from 'react';
import { useAIProvider } from '@packages/ai-providers';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from '@packages/shared-ui';
import { 
  Beaker, 
  FileCode, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Download,
  Play,
  Settings,
  Zap
} from 'lucide-react';

interface TestCase {
  name: string;
  input: string;
  expected: string;
  description: string;
}

interface TestSuite {
  framework: string;
  code: string;
  testCases: TestCase[];
  coverage: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
}

const FRAMEWORKS = [
  { id: 'jest', name: 'Jest', language: 'javascript' },
  { id: 'vitest', name: 'Vitest', language: 'javascript' },
  { id: 'pytest', name: 'Pytest', language: 'python' },
  { id: 'unittest', name: 'unittest', language: 'python' },
  { id: 'mocha', name: 'Mocha', language: 'javascript' },
  { id: 'junit', name: 'JUnit', language: 'java' },
];

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
];

function App() {
  const [code, setCode] = useState(`function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

module.exports = { add, multiply };`);

  const [language, setLanguage] = useState('javascript');
  const [framework, setFramework] = useState('jest');
  const [testSuite, setTestSuite] = useState<TestSuite | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { chat, isLoading } = useAIProvider();

  const generateTests = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter some code to generate tests for');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setTestSuite(null);

    try {
      const systemPrompt = `You are an expert test generator. Generate comprehensive unit tests for the provided code.
Return a JSON response with this exact structure:
{
  "framework": "${framework}",
  "code": "<complete test code>",
  "testCases": [
    {
      "name": "<test name>",
      "input": "<test input>",
      "expected": "<expected output>",
      "description": "<what this tests>"
    }
  ],
  "coverage": {
    "statements": <percentage>,
    "branches": <percentage>,
    "functions": <percentage>,
    "lines": <percentage>
  }
}

Generate tests for:
- Happy path (normal inputs)
- Edge cases (empty, null, undefined, zero)
- Error conditions (invalid inputs)
- Boundary conditions

Make tests comprehensive with clear descriptions.`;

      const result = await chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Language: ${language}\n\nCode to test:\n${code}` },
      ]);

      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setTestSuite(parsed);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate tests');
    } finally {
      setIsGenerating(false);
    }
  }, [code, language, framework, chat]);

  const copyTests = useCallback(() => {
    if (testSuite) {
      navigator.clipboard.writeText(testSuite.code);
    }
  }, [testSuite]);

  const downloadTests = useCallback(() => {
    if (!testSuite) return;
    const blob = new Blob([testSuite.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `test.${framework === 'pytest' || framework === 'unittest' ? 'py' : 'test.js'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [testSuite, framework]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-600 rounded-lg">
              <Beaker className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Test Generator</h1>
              <p className="text-sm text-gray-500">Automated unit test generation</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FRAMEWORKS.map((fw) => (
                <option key={fw.id} value={fw.id}>{fw.name}</option>
              ))}
            </select>
            <Button onClick={generateTests} loading={isGenerating} disabled={!code.trim()}>
              <Zap className="h-4 w-4 mr-2" />
              Generate Tests
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
              <h2 className="font-semibold text-gray-800">Source Code</h2>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 rounded"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="flex-1 w-full p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              spellCheck={false}
            />
          </Card>

          {/* Generated Tests */}
          <Card className="h-[calc(100vh-200px)] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Generated Tests</h2>
              {testSuite && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyTests}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadTests}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4">Generating tests...</p>
                </div>
              ) : testSuite ? (
                <div className="space-y-4">
                  {/* Coverage */}
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(testSuite.coverage).map(([key, value]) => (
                      <div key={key} className="p-3 bg-gray-50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-gray-800">{value}%</p>
                        <p className="text-xs text-gray-500 capitalize">{key}</p>
                      </div>
                    ))}
                  </div>

                  {/* Test Code */}
                  <div className="relative">
                    <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto max-h-64">
                      <code>{testSuite.code}</code>
                    </pre>
                  </div>

                  {/* Test Cases */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Test Cases ({testSuite.testCases.length})</h3>
                    <div className="space-y-2">
                      {testSuite.testCases.map((tc, i) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="font-medium text-gray-800">{tc.name}</span>
                          </div>
                          <p className="text-sm text-gray-600">{tc.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Beaker className="h-16 w-16 mb-4 opacity-50" />
                  <p>Paste your code and click "Generate Tests" to get started</p>
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
