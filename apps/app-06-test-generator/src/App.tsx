import React, { useState, useCallback } from 'react';
import { TestTube2, Sparkles, ArrowRight, CheckCircle2, FileCode, Zap, Terminal, Play, Copy, Check } from 'lucide-react';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from './lib/components';

function App() {
  const [code, setCode] = useState('function add(a, b) {\n  return a + b;\n}');
  const [testCode, setTestCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApp, setShowApp] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateTests = useCallback(async () => {
    if (!code.trim()) return;
    setIsGenerating(true);
    setTestCode('');
    await new Promise(r => setTimeout(r, 2000));
    setTestCode(`import { describe, it, expect } from 'vitest';
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
});`);
    setIsGenerating(false);
  }, [code]);

  const copyTests = useCallback(() => {
    navigator.clipboard.writeText(testCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [testCode]);

  if (showApp) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg"><TestTube2 className="h-5 w-5 text-white" /></div>
              <span className="font-bold">AI Test Generator</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowApp(false)}>Back to Home</Button>
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h2 className="font-semibold mb-4 flex items-center gap-2"><FileCode className="h-5 w-5" />Your Code</h2>
              <textarea value={code} onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 font-mono text-sm bg-gray-950 text-cyan-300 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Paste code to generate tests..." />
              <Button onClick={generateTests} loading={isGenerating} disabled={!code.trim()} className="mt-4 w-full">
                <Sparkles className="h-4 w-4 mr-2" />Generate Tests
              </Button>
            </Card>
            <Card>
              <h2 className="font-semibold mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2"><Terminal className="h-5 w-5" />Generated Tests</span>
                {testCode && <Button variant="ghost" size="sm" onClick={copyTests}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>}
              </h2>
              {testCode ? (
                <pre className="whitespace-pre-wrap text-sm bg-gray-950 text-green-400 p-4 rounded-lg h-96 overflow-auto">{testCode}</pre>
              ) : (
                <div className="h-96 flex items-center justify-center text-gray-400">
                  <div className="text-center"><TestTube2 className="h-16 w-16 opacity-50" /><p className="mt-2">Tests will appear here</p></div>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-indigo-900/20"></div>
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      <nav className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl"><TestTube2 className="h-6 w-6 text-white" /></div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AI Test Generator</span>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowApp(true)}><Play className="h-4 w-4 mr-2" />Try App</Button>
        </div>
      </nav>
      <section className="relative z-10 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-8">
            <Sparkles className="h-4 w-4" /><span>AI-Powered Testing</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">Generate Tests</span>
            <br /><span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">10x Faster</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Generate comprehensive unit tests instantly with AI.</p>
          <Button size="lg" onClick={() => setShowApp(true)} className="group">
            Start Testing<ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <span className="text-gray-400 text-sm">test-generator.ts</span>
              <Button size="sm" onClick={() => setShowApp(true)}>Try It →</Button>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Your Code</div>
                <pre className="text-sm font-mono text-gray-300 overflow-x-auto"><code>{`function add(a, b) {
  return a + b;
}`}</code></pre>
              </div>
              <div className="space-y-3">
                <div className="text-xs text-blue-400 mb-2 uppercase tracking-wider flex items-center gap-2"><Sparkles className="h-3 w-3" />Generated Tests</div>
                {['✓ Positive numbers', '✓ Negative numbers', '✓ Zero handling', '✓ Decimal numbers', '✓ Large numbers'].map((test, i) => (
                  <div key={i} className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-400" /><span className="text-sm text-cyan-400">{test}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative p-12 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Test Smarter?</h2>
            <p className="text-cyan-100 mb-8">Generate comprehensive tests in seconds.</p>
            <Button size="lg" variant="secondary" onClick={() => setShowApp(true)} className="group">
              Launch App<ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
export default App;
