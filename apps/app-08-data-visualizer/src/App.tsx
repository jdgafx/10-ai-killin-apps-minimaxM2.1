import React, { useState } from 'react';
import { 
  BarChart3, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Lightbulb,
  DollarSign,
  Zap,
  Target,
  Clock,
  Globe,
  Layers,
  RefreshCw
} from 'lucide-react';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from './lib/components';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Data Visualizer
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm mb-8">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Analytics</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                See Your Data
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Transform raw data into stunning visualizations with AI-powered insights. 
              Spot trends, outliers, and opportunities instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="group">
                Start Visualizing
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </div>
          </div>

          {/* Chart Demo */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-400 text-sm">ROI Analysis Dashboard</span>
                </div>
                <span className="text-indigo-400 text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Insights
                </span>
              </div>
              <div className="p-6 grid md:grid-cols-3 gap-6">
                {/* Simple Chart Visual */}
                <div className="md:col-span-2 bg-gray-800/50 rounded-xl p-6">
                  <div className="flex items-end justify-center gap-4 h-48">
                    {[
                      { label: 'Jan', value: 40, color: 'bg-red-500' },
                      { label: 'Feb', value: 65, color: 'bg-yellow-500' },
                      { label: 'Mar', value: 45, color: 'bg-red-500' },
                      { label: 'Apr', value: 80, color: 'bg-green-500' },
                      { label: 'May', value: 55, color: 'bg-yellow-500' },
                      { label: 'Jun', value: 95, color: 'bg-green-500' },
                    ].map((bar, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div 
                          className={`w-12 ${bar.color} rounded-t-lg transition-all duration-500`}
                          style={{ height: `${bar.value * 1.5}px` }}
                        ></div>
                        <span className="text-gray-400 text-xs">{bar.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span className="text-gray-400 text-xs">Cost</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="text-gray-400 text-xs">Value</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-xs text-purple-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />
                    AI Insights
                  </div>
                  
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-green-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-green-400 font-medium">✓ Strong Growth</div>
                        <div className="text-xs text-gray-400 mt-1">65% revenue increase</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 text-blue-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-blue-400 font-medium">✓ ROI: +50%</div>
                        <div className="text-xs text-gray-400 mt-1">Senior devs worth it</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-purple-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-purple-400 font-medium">✓ Key Finding</div>
                        <div className="text-xs text-gray-400 mt-1">4x value at 2x cost</div>
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
              { value: '50M+', label: 'Data Points' },
              { value: '99.9%', label: 'Accuracy' },
              { value: '10x', label: 'Faster Analysis' },
              { value: '100K+', label: 'Charts Created' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
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
              Transform data into actionable insights
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: 'Multiple Chart Types',
                description: 'Line, bar, pie, scatter, area charts and more.',
                gradient: 'from-indigo-500 to-purple-500'
              },
              {
                icon: <Sparkles className="h-6 w-6" />,
                title: 'AI Insights',
                description: 'Get automatic insights, trends, and recommendations.',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: 'Lightning Fast',
                description: 'Render complex charts in milliseconds.',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: 'Trend Detection',
                description: 'Automatically spot trends and anomalies.',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: <RefreshCw className="h-6 w-6" />,
                title: 'Real-Time Updates',
                description: 'Live data visualization with auto-refresh.',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: <Layers className="h-6 w-6" />,
                title: 'Easy Export',
                description: 'Export charts as PNG, SVG, or embed anywhere.',
                gradient: 'from-rose-500 to-red-500'
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
      <section id="how-it-works" className="relative z-10 py-24 bg-gradient-to-b from-transparent via-indigo-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Create visualizations in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Paste Data',
                description: 'Enter your JSON or CSV data',
                icon: <BarChart3 className="h-8 w-8" />
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our AI analyzes and suggests visualizations',
                icon: <Sparkles className="h-8 w-8" />
              },
              {
                step: '03',
                title: 'Visualize',
                description: 'View beautiful, interactive charts',
                icon: <TrendingUp className="h-8 w-8" />
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-xl opacity-30 rounded-full"></div>
                  <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white/10 border border-white/20 rounded-2xl">
                    {item.icon}
                  </div>
                </div>
                <div className="text-indigo-400 text-sm font-mono mb-2">{item.step}</div>
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
          <div className="relative p-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">See Your Data Clearly</h2>
              <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
                Join 100,000+ analysts who trust Data Visualizer for insights.
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
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">Data Visualizer</span>
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
