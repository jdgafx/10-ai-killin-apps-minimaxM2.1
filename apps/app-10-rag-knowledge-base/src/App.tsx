import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  ArrowRight,
  Search,
  FileText,
  Brain,
  Zap,
  Shield,
  Clock,
  Globe,
  Layers,
  Upload,
  Database
} from 'lucide-react';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from './lib/components';

function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');

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
                RAG Knowledge Base
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
              <Brain className="h-4 w-4" />
              <span>Powered by RAG Technology</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-amber-200 to-orange-200 bg-clip-text text-transparent">
                Knowledge at
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Your Fingertips
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Build intelligent knowledge bases with RAG. Upload documents, ask questions, 
              and get instant answers powered by AI retrieval.
            </p>
            
            {/* Search Input */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-2xl opacity-50 group-hover:opacity-75 blur transition-all duration-300"></div>
                <div className="relative flex items-center gap-4 bg-gray-900/90 backdrop-blur-xl rounded-2xl p-2">
                  <div className="pl-4">
                    <Search className="h-6 w-6 text-amber-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Ask a question about your knowledge base..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
                  />
                  <Button size="lg">
                    <Sparkles className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Demo */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-400 text-sm">Knowledge Base Q&A</span>
                </div>
                <span className="text-amber-400 text-sm flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  5 Documents Indexed
                </span>
              </div>
              
              <div className="p-6 grid md:grid-cols-2 gap-6">
                {/* Results */}
                <div className="space-y-4">
                  <div className="text-xs text-orange-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />
                    Search Results
                  </div>
                  
                  {[
                    { title: 'API Documentation.pdf', match: '94.2%', snippet: 'The API endpoint accepts POST requests with JSON payload...' },
                    { title: 'Architecture Guide.md', match: '87.5%', snippet: 'Our microservices architecture consists of multiple services...' },
                    { title: 'Deployment Steps.txt', match: '82.1%', snippet: 'To deploy, run the following commands in order...' },
                  ].map((result, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-amber-400" />
                          <span className="text-sm text-amber-400 font-medium">{result.title}</span>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">{result.match} match</span>
                      </div>
                      <p className="text-sm text-gray-400">{result.snippet}</p>
                    </div>
                  ))}
                </div>
                
                {/* Stats */}
                <div className="space-y-3">
                  <div className="text-xs text-yellow-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />
                    Index Statistics
                  </div>
                  
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Database className="h-5 w-5 text-amber-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-amber-400 font-medium">✓ 1,247 Chunks Indexed</div>
                        <div className="text-xs text-gray-400 mt-1">From 5 documents</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-orange-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-orange-400 font-medium">✓ Vector Similarity</div>
                        <div className="text-xs text-gray-400 mt-1">Semantic search enabled</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-yellow-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-yellow-400 font-medium">✓ Query Time</div>
                        <div className="text-xs text-gray-400 mt-1">~45ms average response</div>
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
              { value: '10M+', label: 'Documents Indexed' },
              { value: '99.9%', label: 'Accuracy Rate' },
              { value: '50ms', label: 'Avg Query Time' },
              { value: '100K+', label: 'Active Users' },
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
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The most advanced RAG knowledge base system
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Search className="h-6 w-6" />,
                title: 'Semantic Search',
                description: 'Find relevant information using natural language queries.',
                gradient: 'from-amber-500 to-orange-500'
              },
              {
                icon: <Upload className="h-6 w-6" />,
                title: 'Multi-Format Support',
                description: 'Upload PDFs, Word docs, Markdown, and more.',
                gradient: 'from-orange-500 to-red-500'
              },
              {
                icon: <Brain className="h-6 w-6" />,
                title: 'Vector Embeddings',
                description: 'State-of-the-art semantic understanding.',
                gradient: 'from-yellow-500 to-amber-500'
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: 'Lightning Fast',
                description: 'Get answers in under 50ms on average.',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: 'Secure & Private',
                description: 'Your data is encrypted and never shared.',
                gradient: 'from-blue-500 to-indigo-500'
              },
              {
                icon: <Layers className="h-6 w-6" />,
                title: 'Easy Integration',
                description: 'API access for seamless integration.',
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
      <section id="how-it-works" className="relative z-10 py-24 bg-gradient-to-b from-transparent via-amber-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Build your knowledge base in three steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Upload Documents',
                description: 'Add PDFs, docs, and text files to your knowledge base',
                icon: <Upload className="h-8 w-8" />
              },
              {
                step: '02',
                title: 'AI Indexing',
                description: 'Our AI creates vector embeddings for semantic search',
                icon: <Brain className="h-8 w-8" />
              },
              {
                step: '03',
                title: 'Ask Questions',
                description: 'Get instant, accurate answers from your documents',
                icon: <Search className="h-8 w-8" />
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Unlock Your Knowledge</h2>
              <p className="text-amber-100 mb-8 max-w-xl mx-auto">
                Transform your documents into an intelligent, searchable knowledge base.
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
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">RAG Knowledge Base</span>
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
