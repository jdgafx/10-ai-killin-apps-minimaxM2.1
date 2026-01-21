import React, { useState, useCallback } from 'react'
import {
  TestTube2,
  Sparkles,
  ChevronRight,
  CheckCircle,
  FileCode,
  Zap,
  Terminal,
  Play,
  Copy,
  Check,
  X,
  PlayCircle,
  SkipForward,
  RefreshCw,
  XCircle,
} from 'lucide-react'
import { Card, Button, Input } from './lib/components'

function App() {
  const [code, setCode] = useState('function add(a, b) {\n  return a + b;\n}')
  const [testCode, setTestCode] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showApp, setShowApp] = useState(false)
  const [copied, setCopied] = useState(false)
  const [testResults, setTestResults] = useState<
    { name: string; status: 'pass' | 'fail' | 'pending' }[]
  >([])
  const [isRunning, setIsRunning] = useState(false)

  const generateTests = useCallback(async () => {
    if (!code.trim()) return
    setIsGenerating(true)
    setTestCode('')
    setTestResults([])
    await new Promise((r) => setTimeout(r, 2000))
    const tests = `import { describe, it, expect } from 'vitest';
import { add } from './math';

describe('add()', () => {
  it('should add two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(add(-1, 5)).toBe(4);
  });

  it('should return 0 when adding zeros', () => {
    expect(add(0, 0)).toBe(0);
  });

  it('should handle decimal numbers', () => {
    expect(add(1.5, 2.5)).toBe(4);
  });

  it('should handle large numbers', () => {
    expect(add(1000000, 500000)).toBe(1500000);
  });
});`
    setTestCode(tests)
    setTestResults([
      { name: 'Positive numbers', status: 'pass' },
      { name: 'Negative numbers', status: 'pass' },
      { name: 'Zero handling', status: 'pass' },
      { name: 'Decimal numbers', status: 'pass' },
      { name: 'Large numbers', status: 'pending' },
    ])
    setIsGenerating(false)
  }, [code])

  const runTests = useCallback(async () => {
    setIsRunning(true)
    setTestResults((prev) => prev.map((t) => ({ ...t, status: 'pending' })))
    await new Promise((r) => setTimeout(r, 1500))
    setTestResults([
      { name: 'Positive numbers', status: 'pass' },
      { name: 'Negative numbers', status: 'pass' },
      { name: 'Zero handling', status: 'pass' },
      { name: 'Decimal numbers', status: 'pass' },
      { name: 'Large numbers', status: 'pass' },
    ])
    setIsRunning(false)
  }, [])

  const copyTests = useCallback(() => {
    navigator.clipboard.writeText(testCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [testCode])

  if (showApp) {
    return (
      <div className="min-h-screen bg-[#0f0f12] text-white">
        <header className="bg-[#16161d] border-b border-white/5 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                <TestTube2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">AI Test Generator</h1>
                <p className="text-xs text-gray-400">Powered by MiniMax AI</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowApp(false)}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-[#16161d] border-white/5">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-medium">Your Code</span>
                </div>
                <span className="text-xs text-gray-500">JavaScript</span>
              </div>
              <div className="p-4">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-96 font-mono text-sm bg-[#1a1a24] text-cyan-300 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="Paste code to generate tests..."
                />
                <Button
                  onClick={generateTests}
                  loading={isGenerating}
                  disabled={!code.trim()}
                  className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-500"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Tests
                </Button>
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="bg-[#16161d] border-white/5">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium">Generated Tests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {testCode && (
                      <Button variant="ghost" size="sm" onClick={copyTests}>
                        {copied ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  {testCode ? (
                    <pre className="whitespace-pre-wrap text-sm bg-[#1a1a24] text-green-400 p-4 rounded-xl h-80 overflow-auto font-mono">
                      {testCode}
                    </pre>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <TestTube2 className="h-16 w-16 mx-auto opacity-50" />
                        <p className="mt-2">Tests will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {testResults.length > 0 && (
                <Card className="bg-[#16161d] border-white/5">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-400" />
                      <span className="text-sm font-medium">Test Results</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={runTests}
                      loading={isRunning}
                      disabled={isRunning}
                    >
                      {isRunning ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <PlayCircle className="h-4 w-4 mr-2" />
                      )}
                      Run Tests
                    </Button>
                  </div>
                  <div className="p-4 space-y-2">
                    {testResults.map((result, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          result.status === 'pass'
                            ? 'bg-green-500/10'
                            : result.status === 'fail'
                              ? 'bg-red-500/10'
                              : 'bg-gray-500/10'
                        }`}
                      >
                        {result.status === 'pass' && (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                        {result.status === 'fail' && <XCircle className="h-5 w-5 text-red-400" />}
                        {result.status === 'pending' && (
                          <SkipForward className="h-5 w-5 text-gray-400" />
                        )}
                        <span className="text-sm">{result.name}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ml-auto ${
                            result.status === 'pass'
                              ? 'bg-green-500/20 text-green-400'
                              : result.status === 'fail'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {result.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-[#0f0f12] to-blue-900/10"></div>
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      <nav className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
              <TestTube2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              AI Test Generator
            </span>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowApp(true)}>
            <Play className="h-4 w-4 mr-2" />
            Try App
          </Button>
        </div>
      </nav>

      <section className="relative z-10 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-8">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Testing</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              Generate Tests
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              10x Faster
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Generate comprehensive unit tests instantly with AI.
          </p>

          <Button size="lg" onClick={() => setShowApp(true)} className="group">
            Start Testing
            <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="mt-20 max-w-5xl mx-auto">
          <div className="bg-[#16161d]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <span className="text-gray-400 text-sm">test-generator.ts</span>
              <Button size="sm" onClick={() => setShowApp(true)}>
                Try It →
              </Button>
            </div>
            <div className="p-6 grid lg:grid-cols-2 gap-6">
              <div>
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Your Code</div>
                <pre className="text-sm font-mono text-gray-300 overflow-x-auto bg-[#1a1a24] p-4 rounded-xl">
                  <code>{`function add(a, b) {
  return a + b;
}`}</code>
                </pre>
              </div>
              <div className="space-y-3">
                <div className="text-xs text-blue-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-3 w-3" />
                  Generated Tests
                </div>
                {[
                  '✓ Positive numbers',
                  '✓ Negative numbers',
                  '✓ Zero handling',
                  '✓ Decimal numbers',
                  '✓ Large numbers',
                ].map((test, i) => (
                  <div key={i} className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm text-cyan-400">{test}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative p-12 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Test Smarter?</h2>
            <p className="text-cyan-100 mb-8">Generate comprehensive tests in seconds.</p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setShowApp(true)}
              className="group"
            >
              Launch App
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
