import React, { useState } from 'react';
import { 
  TestTube2, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  FileCode,
  Zap,
  Shield,
  Clock,
  GraduationCap,
  Target,
  Code2,
  Layers
} from 'lucide-react';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from './lib/components';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-indigo-900/20"></div>
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                <TestTube2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                AI Test Generator
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
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Paste your code and instantly generate comprehensive unit tests. Cover edge cases, 
              improve code quality, and ship with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="group">
                Start Testing
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                View Documentation
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
                  <span className="text-gray-400 text-sm">test-generator.ts</span>
                </div>
                <span className="text-cyan-400 text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  5 tests generated
                </span>
              </div>
              <div className="p-6 grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Your Code</div>
                  <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
                    <code>{`function add(a, b) {
  return a + b;
}`}</code>
                  </pre>
                </div>
                <div>
                  <div className="text-xs text-blue-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />
                    Generated Tests
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5" />
                        <div>
                          <div className="text-sm text-cyan-400 font-medium">✓ Positive numbers</div>
                          <div className="text-xs text-gray-400 mt-1">add(2, 3) → 5</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5" />
                        <div>
                          <div className="text-sm text-cyan-400 font-medium">✓ Negative numbers</div>
                          <div className="text-xs text-gray-400 mt-1">add(-1, 5) → 4</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5" />
                        <div>
                          <div className="text-sm text-cyan-400 font-medium">✓ Zero handling</div>
                          <div className="text-xs text-gray-400 mt-1">add(0, 0) → 0</div>
                        </div>
                      </div>
                    </div>
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
              { value: '10M+', label: 'Tests Generated' },
              { value: '99.9%', label: 'Coverage Rate' },
              { value: '5x', label: 'Faster Testing' },
              { value: '50+', label: 'Languages' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
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
            <h2 className="text-4xl font-bold mb-4">Why AI Test Generator?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The most comprehensive AI-powered testing solution
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="h-6 w-6" />,
                title: 'Instant Generation',
                description: 'Get comprehensive test suites in seconds, not hours.',
                gradient: 'from-cyan-500 to-blue-500'
              },
              {
                icon: <Target className="h-6 w-6" />,
                title: 'Edge Case Coverage',
                description: 'Automatically covers edge cases you might have missed.',
                gradient: 'from-blue-500 to-indigo-500'
              },
              {
                icon: <FileCode className="h-6 w-6" />,
                title: 'Multi-Framework',
                description: 'Supports Jest, Vitest, Mocha, Pytest, and more.',
                gradient: 'from-indigo-500 to-violet-500'
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: 'Type Safe',
                description: 'Generates type-safe tests for TypeScript projects.',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: <Clock className="h-6 w-6" />,
                title: 'Save Time',
                description: 'Save 80% of testing time with AI-powered generation.',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: <GraduationCap className="h-6 w-6" />,
                title: 'Learn Testing',
                description: 'Learn best practices from generated test patterns.',
                gradient: 'from-purple-500 to-pink-500'
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
      <section id="how-it-works" className="relative z-10 py-24 bg-gradient-to-b from-transparent via-cyan-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Start testing in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Paste Your Code',
                description: 'Copy and paste your function or module',
                icon: <FileCode className="h-8 w-8" />
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our AI analyzes code structure and logic',
                icon: <Sparkles className="h-8 w-8" />
              },
              {
                step: '03',
                title: 'Get Tests',
                description: 'Receive comprehensive test suite instantly',
                icon: <TestTube2 className="h-8 w-8" />
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-xl opacity-30 rounded-full"></div>
                  <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white/10 border border-white/20 rounded-2xl">
                    {item.icon}
                  </div>
                </div>
                <div className="text-cyan-400 text-sm font-mono mb-2">{item.step}</div>
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
          <div className="relative p-12 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Test Smarter?</h2>
              <p className="text-cyan-100 mb-8 max-w-xl mx-auto">
                Join developers who ship with confidence using AI-powered tests.
              </p>
              <Button size="lg" variant="secondary" className="group">
                Get Started Free
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
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                <TestTube2 className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">AI Test Generator</span>
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
