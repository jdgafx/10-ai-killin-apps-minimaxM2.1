import React, { useState } from 'react';
import { 
  MessageSquare, 
  FileText, 
  Search, 
  Sparkles,
  ArrowRight,
  Upload,
  Zap,
  Shield,
  Clock,
  Bot,
  Send,
  CheckCircle2,
  Brain
} from 'lucide-react';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from './lib/components';

function LandingPage() {
  const [question, setQuestion] = useState('');

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-cyan-900/20 to-teal-900/20"></div>
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Document Chat
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
              <Brain className="h-4 w-4" />
              <span>Powered by RAG Technology</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-teal-200 bg-clip-text text-transparent">
                Chat with Your Documents
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Upload any document and ask questions in natural language. Our AI understands context, 
              finds relevant information, and provides accurate answers instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="group">
                Start Chatting
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Chat Demo */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6 space-y-4">
                {/* Chat Message 1 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-none p-4 max-w-md">
                    <p className="text-sm text-gray-300">
                      Hi! I've analyzed your document. What would you like to know about it?
                    </p>
                  </div>
                </div>
                
                {/* User Message */}
                <div className="flex gap-4 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">You</span>
                  </div>
                  <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl rounded-tr-none p-4 max-w-md">
                    <p className="text-sm text-white">
                      What are the key findings in this report?
                    </p>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-none p-4 max-w-lg">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-300">
                          Based on my analysis, here are the <span className="text-cyan-400 font-semibold">key findings</span>:
                        </p>
                        <ul className="mt-2 space-y-2 text-sm text-gray-400">
                          <li className="flex items-start gap-2">
                            <span className="text-cyan-400">•</span>
                            Revenue increased by 47% in Q4
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-cyan-400">•</span>
                            Customer retention improved to 94%
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-cyan-400">•</span>
                            New market expansion successful
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Ask a question about your document..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                      <Upload className="h-5 w-5" />
                    </button>
                  </div>
                  <Button>
                    <Send className="h-5 w-5" />
                  </Button>
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
              { value: '10M+', label: 'Documents Processed' },
              { value: '99.8%', label: 'Accuracy Rate' },
              { value: '50K+', label: 'Active Users' },
              { value: '0.3s', label: 'Avg Response Time' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-2">
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
            <h2 className="text-4xl font-bold mb-4">Why Choose Document Chat?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The most advanced AI-powered document Q&A platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Search className="h-6 w-6" />,
                title: 'Smart Search',
                description: 'Find exactly what you need with intelligent semantic search that understands context.',
                gradient: 'from-cyan-500 to-blue-500'
              },
              {
                icon: <FileText className="h-6 w-6" />,
                title: 'Multi-Format Support',
                description: 'Upload PDFs, Word docs, text files, and more. We support all major document formats.',
                gradient: 'from-teal-500 to-green-500'
              },
              {
                icon: <Brain className="h-6 w-6" />,
                title: 'Context Understanding',
                description: 'Our AI understands the full context of your documents, not just keywords.',
                gradient: 'from-blue-500 to-indigo-500'
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: 'Lightning Fast',
                description: 'Get answers in under 1 second. Our optimized pipeline delivers results instantly.',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: 'Secure & Private',
                description: 'Your documents are encrypted and never shared. Enterprise-grade security.',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: <Clock className="h-6 w-6" />,
                title: '24/7 Availability',
                description: 'Access your documents anytime, anywhere. No waiting, no scheduling.',
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
              Get answers from your documents in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Upload Document',
                description: 'Drag and drop your PDF, Word doc, or any supported file format',
                icon: <Upload className="h-8 w-8" />
              },
              {
                step: '02',
                title: 'AI Processing',
                description: 'Our AI analyzes and indexes your document for instant retrieval',
                icon: <Brain className="h-8 w-8" />
              },
              {
                step: '03',
                title: 'Ask Questions',
                description: 'Type your question in natural language and get instant answers',
                icon: <MessageSquare className="h-8 w-8" />
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 blur-xl opacity-30 rounded-full"></div>
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
          <div className="relative p-12 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Unlock Your Documents?</h2>
              <p className="text-cyan-100 mb-8 max-w-xl mx-auto">
                Start chatting with your documents today. No credit card required.
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
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">Document Chat</span>
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
