import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  ArrowRight,
  Cpu,
  Target,
  Activity,
  Users,
  Zap,
  Layers,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw
} from 'lucide-react';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from './lib/components';

function LandingPage() {
  const [taskInput, setTaskInput] = useState('Research AI trends and create a summary report');

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                Autonomous Agent
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm mb-8">
              <Sparkles className="h-4 w-4" />
              <span>Multi-Agent Orchestration</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-violet-200 to-pink-200 bg-clip-text text-transparent">
                Your AI Team
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                Works for You
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Deploy autonomous AI agents that research, analyze, and execute complex tasks. 
              Powered by specialized agents for every workflow.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="group">
                Deploy Agent
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Agent Demo */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-400 text-sm">Autonomous Agent Orchestrator</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    Running
                  </span>
                </div>
              </div>
              
              <div className="p-6 grid md:grid-cols-3 gap-6">
                {/* Task Input */}
                <div className="md:col-span-1">
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Task</div>
                  <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                    <p className="text-sm text-violet-300">Research AI trends and create a summary report</p>
                  </div>
                  
                  {/* Agents */}
                  <div className="mt-4 space-y-2">
                    <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Agents</div>
                    {[
                      { name: 'Researcher', status: 'completed', icon: '✓' },
                      { name: 'Coder', status: 'completed', icon: '✓' },
                      { name: 'Analyzer', status: 'working', icon: '⚡' },
                      { name: 'Writer', status: 'pending', icon: '○' },
                    ].map((agent, i) => (
                      <div key={i} className={`p-3 rounded-lg border ${
                        agent.status === 'completed' 
                          ? 'bg-green-500/10 border-green-500/20' 
                          : agent.status === 'working'
                          ? 'bg-blue-500/10 border-blue-500/20'
                          : 'bg-gray-500/10 border-gray-500/20'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={agent.status === 'completed' ? 'text-green-400' : agent.status === 'working' ? 'text-blue-400' : 'text-gray-400'}>
                              {agent.icon}
                            </span>
                            <span className="text-sm text-gray-300">{agent.name}</span>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            agent.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            agent.status === 'working' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {agent.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Progress */}
                <div className="md:col-span-2">
                  <div className="text-xs text-pink-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />
                    Execution Progress
                  </div>
                  
                  <div className="space-y-3">
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-violet-500 to-pink-500 h-2 rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
                    </div>
                    
                    {/* Steps */}
                    {[
                      { step: '1', name: 'Decompose Task', status: 'completed', time: '1.2s' },
                      { step: '2', name: 'Research Phase', status: 'completed', time: '3.4s' },
                      { step: '3', name: 'Data Analysis', status: 'completed', time: '2.1s' },
                      { step: '4', name: 'Report Generation', status: 'working', time: '-' },
                      { step: '5', name: 'Final Review', status: 'pending', time: '-' },
                    ].map((item, i) => (
                      <div key={i} className={`p-3 rounded-lg border ${
                        item.status === 'completed' 
                          ? 'bg-green-500/10 border-green-500/20' 
                          : item.status === 'working'
                          ? 'bg-blue-500/10 border-blue-500/20'
                          : 'bg-gray-500/10 border-gray-500/20'
                      }`}>
                        <div className="flex items-center gap-3">
                          {item.status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                          ) : item.status === 'working' ? (
                            <Activity className="h-5 w-5 text-blue-400 animate-pulse" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-gray-400" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Step {item.step}</span>
                              <span className="text-sm text-gray-300">{item.name}</span>
                            </div>
                          </div>
                          {item.status === 'completed' && (
                            <span className="text-xs text-gray-500">{item.time}</span>
                          )}
                          {item.status === 'working' && (
                            <span className="text-xs text-blue-400">Working...</span>
                          )}
                        </div>
                      </div>
                    ))}
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
              { value: '1M+', label: 'Tasks Completed' },
              { value: '99.9%', label: 'Success Rate' },
              { value: '10x', label: 'Faster Workflows' },
              { value: '50K+', label: 'Active Users' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent mb-2">
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
            <h2 className="text-4xl font-bold mb-4">Agent Capabilities</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Specialized AI agents for every task
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Cpu className="h-6 w-6" />,
                title: 'Multi-Agent System',
                description: 'Specialized agents that work together on complex tasks.',
                gradient: 'from-violet-500 to-purple-500'
              },
              {
                icon: <Target className="h-6 w-6" />,
                title: 'Task Decomposition',
                description: 'Automatically break down complex goals into steps.',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: 'Real-Time Execution',
                description: 'Watch agents work in real-time with live updates.',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: <Layers className="h-6 w-6" />,
                title: 'Workflow Automation',
                description: 'Automate repetitive tasks end-to-end.',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: 'Team Collaboration',
                description: 'Multiple agents coordinate for complex workflows.',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: <Clock className="h-6 w-6" />,
                title: '24/7 Available',
                description: 'Your AI team works around the clock.',
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
      <section id="how-it-works" className="relative z-10 py-24 bg-gradient-to-b from-transparent via-violet-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Deploy autonomous agents in three steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Define Goal',
                description: 'Describe what you want to accomplish',
                icon: <Target className="h-8 w-8" />
              },
              {
                step: '02',
                title: 'Agents Deploy',
                description: 'AI agents break down and execute tasks',
                icon: <Bot className="h-8 w-8" />
              },
              {
                step: '03',
                title: 'Get Results',
                description: 'Receive complete, actionable results',
                icon: <CheckCircle2 className="h-8 w-8" />
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-pink-500 blur-xl opacity-30 rounded-full"></div>
                  <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white/10 border border-white/20 rounded-2xl">
                    {item.icon}
                  </div>
                </div>
                <div className="text-violet-400 text-sm font-mono mb-2">{item.step}</div>
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
          <div className="relative p-12 bg-gradient-to-r from-violet-600 to-pink-600 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Automate?</h2>
              <p className="text-violet-100 mb-8 max-w-xl mx-auto">
                Let your AI team handle complex tasks while you focus on what matters.
              </p>
              <Button size="lg" variant="secondary" className="group">
                Deploy Your Agent
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
              <div className="p-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">Autonomous Agent</span>
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
