import React, { useState } from 'react';
import { 
  Plug, 
  Sparkles, 
  ArrowRight,
  Activity,
  Database,
  Globe,
  Terminal,
  Zap,
  Shield,
  Layers,
  Code2,
  CheckCircle2
} from 'lucide-react';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from './lib/components';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-red-900/20 to-pink-900/20"></div>
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                <Plug className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                API Integrator
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm mb-8">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered API Testing</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-orange-200 to-red-200 bg-clip-text text-transparent">
                Test APIs
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Like a Pro
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect, test, and integrate any API in seconds. AI-powered suggestions, 
              automatic documentation, and seamless workflow automation.
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

          {/* API Demo */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-400 text-sm">API Integrator</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">GET</span>
                  <span className="text-gray-400 text-sm">/api/users</span>
                </div>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Endpoint</div>
                    <div className="p-3 bg-gray-800 rounded-lg mb-4">
                      <span className="text-green-400 font-mono text-sm">https://api.example.com/users</span>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Response</div>
                    <pre className="text-sm font-mono text-orange-300 overflow-x-auto bg-gray-800 p-4 rounded-lg">
                      <code>{`{
  "status": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "John Doe",
    "timestamp": "2025-01-21T10:30:00Z"
  }
}`}</code>
                    </pre>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-xs text-red-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="h-3 w-3" />
                      AI Analysis
                    </div>
                    
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                        <div>
                          <div className="text-sm text-green-400 font-medium">✓ Status 200 OK</div>
                          <div className="text-xs text-gray-400 mt-1">Response successful</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Activity className="h-4 w-4 text-blue-400 mt-0.5" />
                        <div>
                          <div className="text-sm text-blue-400 font-medium">✓ Response Time</div>
                          <div className="text-xs text-gray-400 mt-1">142ms - Excellent</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Database className="h-4 w-4 text-orange-400 mt-0.5" />
                        <div>
                          <div className="text-sm text-orange-400 font-medium">✓ Data Validation</div>
                          <div className="text-xs text-gray-400 mt-1">All fields valid</div>
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
              { value: '1M+', label: 'APIs Tested' },
              { value: '99.9%', label: 'Uptime' },
              { value: '50K+', label: 'Developers' },
              { value: '0.1s', label: 'Avg Response' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
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
              Everything you need to integrate and test APIs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Terminal className="h-6 w-6" />,
                title: 'API Explorer',
                description: 'Browse and test endpoints with our intuitive interface.',
                gradient: 'from-orange-500 to-red-500'
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: 'Lightning Fast',
                description: 'Get responses in milliseconds, not seconds.',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: 'Secure Testing',
                description: 'Your data is encrypted and never stored.',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: <Layers className="h-6 w-6" />,
                title: 'Multi-Protocol',
                description: 'Support for REST, GraphQL, gRPC, and more.',
                gradient: 'from-blue-500 to-indigo-500'
              },
              {
                icon: <Code2 className="h-6 w-6" />,
                title: 'Auto Documentation',
                description: 'Generate API docs automatically from requests.',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: <Globe className="h-6 w-6" />,
                title: 'Global Network',
                description: 'Test APIs from multiple regions worldwide.',
                gradient: 'from-cyan-500 to-blue-500'
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
      <section id="how-it-works" className="relative z-10 py-24 bg-gradient-to-b from-transparent via-orange-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Start testing APIs in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Enter Endpoint',
                description: 'Paste your API URL and choose the method',
                icon: <Plug className="h-8 w-8" />
              },
              {
                step: '02',
                title: 'Configure Request',
                description: 'Add headers, body, and authentication',
                icon: <Code2 className="h-8 w-8" />
              },
              {
                step: '03',
                title: 'Get Results',
                description: 'View responses and AI-powered insights',
                icon: <Activity className="h-8 w-8" />
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 blur-xl opacity-30 rounded-full"></div>
                  <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white/10 border border-white/20 rounded-2xl">
                    {item.icon}
                  </div>
                </div>
                <div className="text-orange-400 text-sm font-mono mb-2">{item.step}</div>
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
          <div className="relative p-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Integrate?</h2>
              <p className="text-orange-100 mb-8 max-w-xl mx-auto">
                Join 50,000+ developers who trust API Integrator for their testing needs.
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
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                <Plug className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">API Integrator</span>
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
