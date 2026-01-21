import React, { useState, useCallback } from 'react';
import { Code2, BookOpen, Sparkles, ChevronRight, GraduationCap, FileCode, CheckCircle, Zap, Target, Lightbulb, Terminal, Layers, Play, X } from 'lucide-react';
import { Card, Button, Input } from './lib/components';

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
      <div className="min-h-screen bg-[#0f0f12] text-white">
        <header className="bg-[#16161d] border-b border-white/5 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">Code Explainer</h1>
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
                  <FileCode className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium">Your Code</span>
                </div>
                <span className="text-xs text-gray-500">JavaScript</span>
              </div>
              <div className="p-4">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-96 font-mono text-sm bg-[#1a1a24] text-amber-300 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="Paste code to explain..."
                />
                <Button onClick={explainCode} loading={isExplaining} className="mt-4 w-full bg-gradient-to-r from-amber-500 to-orange-500">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Explain Code
                </Button>
              </div>
            </Card>

            <Card className="bg-[#16161d] border-white/5">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium">Explanation</span>
                </div>
                {explanation && (
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                    Complete
                  </span>
                )}
              </div>
              <div className="p-4 space-y-4">
                {isExplaining ? (
                  <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                      <p className="text-sm text-gray-400 mt-4">Analyzing code...</p>
                    </div>
                  </div>
                ) : explanation ? (
                  <>
                    <div className="p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-amber-400" />
                        <h4 className="text-amber-400 font-medium">What it does</h4>
                      </div>
                      <p className="text-sm text-gray-300">{explanation.what}</p>
                    </div>
                    
                    <div className="p-4 bg-orange-500/10 border-l-4 border-orange-500 rounded-r-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-orange-400" />
                        <h4 className="text-orange-400 font-medium">How it works</h4>
                      </div>
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{explanation.how}</pre>
                    </div>
                    
                    <div className="p-4 bg-yellow-500/10 border-l-4 border-yellow-500 rounded-r-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="h-4 w-4 text-yellow-400" />
                        <h4 className="text-yellow-400 font-medium">Key Concepts</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {explanation.concepts.map((concept, i) => (
                          <span key={i} className="text-xs px-3 py-1 bg-[#1a1a24] text-gray-300 rounded-full">
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-96 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Paste code and click explain</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-[#0f0f12] to-orange-900/10"></div>
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <nav className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Code Explainer
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm mb-8">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Code Understanding</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-amber-200 to-orange-200 bg-clip-text text-transparent">Understand Any Code</span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">In Plain English</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Paste any code snippet and get instant, detailed explanations.</p>
          
          <Button size="lg" onClick={() => setShowApp(true)} className="group">
            Start Explaining
            <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="mt-20 max-w-5xl mx-auto">
          <div className="bg-[#16161d]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <span className="text-gray-400 text-sm">explainer.ts</span>
              <Button size="sm" onClick={() => setShowApp(true)}>Try It →</Button>
            </div>
            <div className="p-6 grid lg:grid-cols-2 gap-6">
              <div>
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Input Code</div>
                <pre className="text-sm font-mono text-amber-300 overflow-x-auto bg-[#1a1a24] p-4 rounded-xl"><code>{code}</code></pre>
              </div>
              <div className="space-y-4">
                <div className="text-xs text-amber-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-3 w-3" />Explanation
                </div>
                <div className="p-4 bg-[#1a1a24] rounded-xl border-l-4 border-amber-500">
                  <h4 className="text-amber-400 font-medium mb-2">What it does</h4>
                  <p className="text-sm text-gray-300">Recursive Fibonacci function calculating nth number in sequence.</p>
                </div>
                <div className="p-4 bg-[#1a1a24] rounded-xl border-l-4 border-orange-500">
                  <h4 className="text-orange-400 font-medium mb-2">Key Concepts</h4>
                  <p className="text-sm text-gray-300">Recursion, Base Case, Time Complexity O(2^n)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative p-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Level Up?</h2>
            <p className="text-amber-100 mb-8">Start understanding code faster today.</p>
            <Button size="lg" variant="secondary" onClick={() => setShowApp(true)} className="group">
              Launch App
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
