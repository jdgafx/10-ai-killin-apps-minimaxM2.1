import React, { useState, useCallback } from 'react';
import { Code2, BookOpen, Sparkles, ArrowRight, GraduationCap, FileCode, CheckCircle2, Zap, Target, Lightbulb, Terminal, Layers, Play, X } from 'lucide-react';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from './lib/components';

function App() {
  const [code, setCode] = useState(`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`);
  const [explanation, setExplanation] = useState<{what: string; how: string; concepts: string[]} | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [showApp, setShowApp] = useState(false);

  const explainCode = useCallback(async () => {
    if (!code.trim()) return;
    setIsExplaining(true);
    setExplanation(null);
    await new Promise(r => setTimeout(r, 2000));
    setExplanation({
      what: "This is a recursive function that calculates the nth number in the Fibonacci sequence, where each number is the sum of the two preceding ones.",
      how: "• Base case: if n ≤ 1, return n\n• Recursive case: fib(n-1) + fib(n-2)\n• Time complexity: O(2^n)\n• Space complexity: O(n) for call stack",
      concepts: ["Recursion", "Base Case", "Fibonacci Sequence", "Memoization opportunity", "Stack overflow risk for large n"]
    });
    setIsExplaining(false);
  }, [code]);

  if (showApp) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg"><BookOpen className="h-5 w-5 text-white" /></div>
              <span className="font-bold">Code Explainer</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowApp(false)}>Back to Home</Button>
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h2 className="font-semibold mb-4 flex items-center gap-2"><FileCode className="h-5 w-5" />Your Code</h2>
              <textarea value={code} onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 font-mono text-sm bg-gray-950 text-amber-300 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Paste code to explain..." />
              <Button onClick={explainCode} loading={isExplaining} className="mt-4 w-full">
                <Sparkles className="h-4 w-4 mr-2" />Explain Code
              </Button>
            </Card>
            <Card>
              <h2 className="font-semibold mb-4 flex items-center gap-2"><Lightbulb className="h-5 w-5 text-amber-400" />Explanation</h2>
              {isExplaining ? (
                <div className="h-96 flex items-center justify-center"><LoadingSpinner /></div>
              ) : explanation ? (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg">
                    <h4 className="text-amber-400 font-medium mb-2 flex items-center gap-2"><Target className="h-4 w-4" />What it does</h4>
                    <p className="text-sm text-gray-300">{explanation.what}</p>
                  </div>
                  <div className="p-4 bg-orange-500/10 border-l-4 border-orange-500 rounded-r-lg">
                    <h4 className="text-orange-400 font-medium mb-2 flex items-center gap-2"><Zap className="h-4 w-4" />How it works</h4>
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap">{explanation.how}</pre>
                  </div>
                  <div className="p-4 bg-yellow-500/10 border-l-4 border-yellow-500 rounded-r-lg">
                    <h4 className="text-yellow-400 font-medium mb-2 flex items-center gap-2"><GraduationCap className="h-4 w-4" />Key Concepts</h4>
                    <p className="text-sm text-gray-300">{explanation.concepts}</p>
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center text-gray-400">
                  <div className="text-center"><BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" /><p>Paste code and click explain</p></div>
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
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-orange-900/20 to-yellow-900/20"></div>
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      <nav className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl"><BookOpen className="h-6 w-6 text-white" /></div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Code Explainer</span>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowApp(true)}><Play className="h-4 w-4 mr-2" />Try App</Button>
        </div>
      </nav>
      <section className="relative z-10 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm mb-8">
            <Sparkles className="h-4 w-4" /><span>AI-Powered Code Understanding</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-amber-200 to-orange-200 bg-clip-text text-transparent">Understand Any Code</span>
            <br /><span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">In Plain English</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Paste any code snippet and get instant, detailed explanations.</p>
          <Button size="lg" onClick={() => setShowApp(true)} className="group">
            Start Explaining<ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <span className="text-gray-400 text-sm">explainer.ts</span>
              <Button size="sm" onClick={() => setShowApp(true)}>Try It →</Button>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Input Code</div>
                <pre className="text-sm font-mono text-amber-300 overflow-x-auto"><code>{code}</code></pre>
              </div>
              <div className="space-y-4">
                <div className="text-xs text-orange-400 mb-2 uppercase tracking-wider flex items-center gap-2"><Sparkles className="h-3 w-3" />Explanation</div>
                <div className="p-4 bg-white/5 rounded-xl border-l-4 border-amber-500">
                  <h4 className="text-amber-400 font-medium mb-2">What it does</h4>
                  <p className="text-sm text-gray-300">Recursive Fibonacci function calculating nth number in sequence.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border-l-4 border-orange-500">
                  <h4 className="text-orange-400 font-medium mb-2">Key Concepts</h4>
                  <p className="text-sm text-gray-300">Recursion, Base Case, Time Complexity O(2^n)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative p-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Level Up?</h2>
            <p className="text-amber-100 mb-8">Start understanding code faster today.</p>
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
