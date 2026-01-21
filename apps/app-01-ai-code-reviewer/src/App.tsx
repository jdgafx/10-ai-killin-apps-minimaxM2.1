import React, { useState, useCallback, useRef } from 'react';
import { 
  Code2, 
  Sparkles, 
  AlertTriangle, 
  FileCode, 
  MessageSquare,
  ChevronRight,
  Copy,
  CheckCircle,
  XCircle,
  Shield,
  Zap,
  TrendingUp,
  Play,
  X
} from 'lucide-react';
import { Card, Button } from './lib/components';

interface ReviewIssue {
  id: string;
  line: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion: string;
  category: 'bug' | 'performance' | 'security' | 'style' | 'best-practice';
}

interface ReviewStats {
  score: number;
  issues: number;
  errors: number;
  warnings: number;
  suggestions: number;
}

const sampleCode = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`;

const sampleReview: ReviewIssue[] = [
  { id: '1', line: 4, severity: 'warning', message: 'Recursive function may cause stack overflow for large n', suggestion: 'Consider using iterative approach or memoization', category: 'performance' },
  { id: '2', line: 2, severity: 'info', message: 'Base case check can be simplified', suggestion: 'Use === 0 comparison for clarity', category: 'style' },
  { id: '3', line: 4, severity: 'warning', message: 'Missing input validation', suggestion: 'Add type checking for negative numbers', category: 'bug' },
];

function App() {
  const [code, setCode] = useState(sampleCode);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResults, setReviewResults] = useState<ReviewIssue[] | null>(null);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [showApp, setShowApp] = useState(false);
  const codeRef = useRef<HTMLTextAreaElement>(null);

  const runReview = useCallback(async () => {
    setIsReviewing(true);
    setReviewResults(null);
    setStats(null);
    await new Promise(r => setTimeout(r, 2500));
    const newStats: ReviewStats = { score: 72, issues: 3, errors: 0, warnings: 2, suggestions: 1 };
    setStats(newStats);
    setReviewResults(sampleReview);
    setIsReviewing(false);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'warning': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'info': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="h-4 w-4" />;
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'bug': return <XCircle className="h-4 w-4" />;
      case 'style': return <Sparkles className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const copyCode = useCallback(() => { navigator.clipboard.writeText(code); }, [code]);

  if (showApp) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white">
        <header className="bg-[#161b22] border-b border-[#30363d] px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-lg">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">AI Code Reviewer</h1>
                <p className="text-xs text-gray-400">Powered by MiniMax AI</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowApp(false)}><X className="h-4 w-4 mr-2" />Close</Button>
          </div>
        </header>
        <main className="max-w-7xl mx-auto p-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-[#0d1117] border-[#30363d]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d]">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">Code</span>
                </div>
                <Button variant="ghost" size="sm" onClick={copyCode}><Copy className="h-4 w-4" /></Button>
              </div>
              <div className="p-0">
                <div className="flex">
                  <div className="w-12 bg-[#161b22] border-r border-[#30363d] py-4 text-right pr-3">
                    {code.split('\n').map((_, i) => <div key={i} className="text-xs text-gray-500 leading-6 font-mono">{i + 1}</div>)}
                  </div>
                  <textarea ref={codeRef} value={code} onChange={(e) => setCode(e.target.value)} className="flex-1 bg-[#0d1117] p-4 font-mono text-sm text-[#c9d1d9] resize-none focus:outline-none leading-6" style={{ minHeight: '400px' }} />
                </div>
              </div>
              <div className="px-4 py-3 border-t border-[#30363d]">
                <Button onClick={runReview} loading={isReviewing} className="w-full"><Sparkles className="h-4 w-4 mr-2" />Run AI Review</Button>
              </div>
            </Card>
            <div className="space-y-6">
              {stats && (
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-400">{stats.score}</span>
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                    <p className="text-xs text-green-400/70 mt-1">Code Score</p>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-red-400">{stats.errors}</span>
                      <XCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Errors</p>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-amber-400">{stats.warnings}</span>
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Warnings</p>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-400">{stats.suggestions}</span>
                      <Sparkles className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Suggestions</p>
                  </div>
                </div>
              )}
              <Card className="bg-[#0d1117] border-[#30363d]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d]">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">AI Review Results</span>
                  </div>
                  {reviewResults && <span className="text-xs px-2 py-1 bg-violet-500/20 text-violet-400 rounded-full">{reviewResults.length} issues</span>}
                </div>
                <div className="p-4 space-y-3">
                  {isReviewing ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto"></div>
                        <p className="text-sm text-gray-400 mt-4">Analyzing your code...</p>
                      </div>
                    </div>
                  ) : reviewResults ? (
                    reviewResults.map((issue) => (
                      <div key={issue.id} onClick={() => setSelectedIssue(selectedIssue === issue.id ? null : issue.id)} className={`p-4 rounded-xl border cursor-pointer transition-all ${getSeverityColor(issue.severity)} ${selectedIssue === issue.id ? 'ring-2 ring-violet-500/50' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getCategoryIcon(issue.category)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs px-2 py-0.5 rounded uppercase font-semibold">{issue.severity}</span>
                              <span className="text-xs text-gray-400">Line {issue.line}</span>
                              <span className="text-xs px-2 py-0.5 bg-[#30363d]/50 rounded capitalize">{issue.category}</span>
                            </div>
                            <p className="text-sm font-medium">{issue.message}</p>
                            {selectedIssue === issue.id && <div className="mt-3 p-3 bg-[#161b22]/80 rounded-lg"><p className="text-xs text-gray-400 mb-1">Suggestion:</p><p className="text-sm text-gray-300">{issue.suggestion}</p></div>}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center py-12 text-gray-400">
                      <div className="text-center"><Code2 className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="text-sm">Paste code and click "Run AI Review"</p></div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/10 via-[#0d1117] to-indigo-900/10"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      <nav className="relative z-10 border-b border-[#30363d]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-xl">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">AI Code Reviewer</span>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowApp(true)}><Play className="h-4 w-4 mr-2" />Launch App</Button>
        </div>
      </nav>
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm mb-8">
              <Sparkles className="h-4 w-4" /><span>AI-Powered Code Analysis</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-violet-200 to-indigo-200 bg-clip-text text-transparent">Review Code</span>
              <br /><span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Like a Senior Engineer</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">Get instant, intelligent code reviews. Catch bugs, improve performance, and follow best practices.</p>
            <Button size="lg" onClick={() => setShowApp(true)} className="group">Start Reviewing<ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" /></Button>
          </div>
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="bg-[#0d1117]/80 backdrop-blur-xl border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d]">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-gray-400">fibonacci.js</span>
                </div>
                <Button size="sm" onClick={() => setShowApp(true)}>Try It →</Button>
              </div>
              <div className="p-6 grid lg:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Your Code</div>
                  <div className="bg-[#161b22] rounded-xl p-4 font-mono text-sm text-[#c9d1d9]">
                    <div className="flex">
                      <div className="w-8 text-right pr-3 text-gray-600 select-none">
                        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="leading-7">{i + 1}</div>)}
                      </div>
                      <div className="flex-1">
                        <div className="leading-7"><span className="text-[#d2a8ff]">function</span> <span className="text-[#79c0ff]">fibonacci</span>(n) {'{'}</div>
                        <div className="leading-7 pl-4"><span className="text-[#ff7b72]">if</span> (n {'<='} 1) <span className="text-[#ff7b72]">return</span> n;</div>
                        <div className="leading-7 pl-4"><span className="text-[#ff7b72]">return</span> fibonacci(n - 1) + fibonacci(n - 2);</div>
                        <div className="leading-7">{'}'}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-xs text-violet-400 mb-2 uppercase tracking-wider flex items-center gap-2"><Sparkles className="h-3 w-3" />AI Review</div>
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <span className="text-xs text-red-400 font-semibold uppercase">Warning</span>
                      <span className="text-xs text-gray-500">Line 4</span>
                    </div>
                    <p className="text-sm text-gray-300">Stack overflow risk</p>
                  </div>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-4 w-4 text-amber-400" />
                      <span className="text-xs text-amber-400 font-semibold uppercase">Performance</span>
                      <span className="text-xs text-gray-500">Line 4</span>
                    </div>
                    <p className="text-sm text-gray-300">Use iterative approach</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative z-10 py-24 bg-[#161b22]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Security Analysis', desc: 'Detect vulnerabilities and security risks', color: 'text-green-400' },
              { icon: Zap, title: 'Performance Tips', desc: 'Optimize for better speed and efficiency', color: 'text-amber-400' },
              { icon: CheckCircle, title: 'Best Practices', desc: 'Follow coding standards and best practices', color: 'text-blue-400' },
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-[#0d1117] border border-[#30363d] rounded-2xl hover:border-violet-500/50 transition-all">
                <div className={`p-3 bg-[#161b22] rounded-xl w-fit ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative p-12 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Level Up?</h2>
            <p className="text-violet-100 mb-8">Get professional code reviews in seconds.</p>
            <Button size="lg" variant="secondary" onClick={() => setShowApp(true)} className="group">Launch App<ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" /></Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
