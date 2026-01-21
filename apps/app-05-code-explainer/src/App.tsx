import React, { useState } from 'react';
import { 
  Code2, 
  BookOpen, 
  Sparkles, 
  ArrowRight,
  GraduationCap,
  FileCode,
  CheckCircle2,
  Zap,
  Target,
  Lightbulb,
  Terminal,
  Layers
} from 'lucide-react';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from './lib/components';

function LandingPage() {
  const [codeInput, setCodeInput] = useState(`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`);

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-orange-900/20 to-yellow-900/20"></div>
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Code Explainer
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a>
              <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm">How it Works</a>
              <Button variant="primary" size="sm">
                Try for Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm mb-8">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Code Understanding</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-amber-200 to-orange-200 bg-clip-text text-transparent">
                Understand Any Code
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                In Plain English
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Paste any code snippet and get instant, detailed explanations. Perfect for learning, 
              code reviews, and understanding legacy systems.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="group">
                Start Explaining
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                View Examples
              </Button>
            </div>
          </div>

          {/* Code Demo */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-400 text-sm">explainer.ts</span>
                </div>
                <span className="text-amber-400 text-sm flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  AI Explanation
                </span>
              </div>
              <div className="p-6 grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Input Code</div>
                  <pre className="text-sm font-mono text-amber-300 overflow-x-auto">
                    <code>{codeInput}</code>
                  </pre>
                </div>
                <div className="space-y-4">
                  <div className="text-xs text-orange-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />
                    Explanation
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-xl border-l-4 border-amber-500">
                    <h4 className="text-amber-400 font-medium mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      What it does
                    </h4>
                    <p className="text-sm text-gray-300">
                      This is a <span className="text-amber-300">recursive function</span> that calculates the nth number in the Fibonacci sequence, where each number is the sum of the two preceding ones.
                    </p>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl border-l-4 border-orange-500">
                    <h4 className="text-orange-400 font-medium mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      How it works
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Base case: if n ≤ 1, return n</li>
                      <li>• Recursive case: fib(n-1) + fib(n-2)</li>
                      <li>• Time complexity: O(2^n)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl border-l-4 border-yellow-500">
                    <h4 className="text-yellow-400 font-medium mb-2 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Key Concepts
                    </h4>
                    <p className="text-sm text-gray-300">
                      This demonstrates <span className="text-yellow-300">recursion</span>, a fundamental programming concept where a function calls itself.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '5M+', label: 'Code Snippets Explained' },
              { value: '50+', label: 'Languages Supported' },
              { value: '99.9%', label: 'Accuracy Rate' },
              { value: '100K+', label: 'Developers' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Code Explainer?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The ultimate tool for understanding complex code
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <BookOpen className="h-6 w-6" />,
                title: 'Beginner Friendly',
                description: 'Explanations tailored to your skill level, from beginner to expert.',
                gradient: 'from-amber-500 to-yellow-500'
              },
              {
                icon: <FileCode className="h-6 w-6" />,
                title: 'Multi-Language',
                description: 'Supports JavaScript, Python, TypeScript, Java, C++, and 45+ more.',
                gradient: 'from-orange-500 to-red-500'
              },
              {
                icon: <Target className="h-6 w-6" />,
                title: 'Line-by-Line',
                description: 'Get detailed explanations for each line of code, not just summaries.',
                gradient: 'from-yellow-500 to-amber-500'
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: 'Instant Results',
                description: 'Get comprehensive explanations in seconds, not minutes.',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: <Layers className="h-6 w-6" />,
                title: 'Concept Mapping',
                description: 'Understand how different parts of code connect and interact.',
                gradient: 'from-teal-500 to-cyan-500'
              },
              {
                icon: <GraduationCap className="h-6 w-6" />,
                title: 'Learning Paths',
                description: 'Get suggested follow-up topics to deepen your understanding.',
                gradient: 'from-blue-500 to-indigo-500'
              },
            ].map((feature, i) => (
              <div key={i} className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative z-10 py-24 bg-gradient-to-b from-transparent via-amber-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Understand any code in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Paste Your Code',
                description: 'Copy and paste any code snippet into the input area',
                icon: <FileCode className="h-8 w-8" />
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our AI analyzes the code structure and logic',
                icon: <Sparkles className="h-8 w-8" />
              },
              {
                step: '03',
                title: 'Get Explanation',
                description: 'Receive detailed, easy-to-understand explanations',
                icon: <BookOpen className="h-8 w-8" />
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 blur-xl opacity-30 rounded-full"></div>
                  <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white/10 border border-white/20 rounded-2xl">
                    {item.icon}
                  </div>
                </div>
                <div className="text-amber-400 text-sm font-mono mb-2">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative p-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Level Up?</h2>
              <p className="text-amber-100 mb-8 max-w-xl mx-auto">
                Join 100,000+ developers who use Code Explainer to learn faster and understand better.
              </p>
              <Button size="lg" variant="secondary" className="group">
                Start Learning Free
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">Code Explainer</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="text-gray-500 text-sm">
              © 2025 All rights reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
