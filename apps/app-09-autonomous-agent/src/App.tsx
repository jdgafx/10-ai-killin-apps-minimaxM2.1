import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Bot, Sparkles, ArrowRight, Cpu, Target, Activity, Users, Zap, Layers, CheckCircle2, Clock, Play, RotateCcw } from 'lucide-react';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from './lib/components';

interface TaskStep { id: string; name: string; description: string; status: 'pending' | 'running' | 'completed'; agent: string; }
interface Agent { id: string; name: string; role: string; status: 'idle' | 'working' | 'completed'; currentTask?: string; }

function App() {
  const [task, setTask] = useState('Research AI trends and create a summary report');
  const [currentTask, setCurrentTask] = useState<{ goal: string; steps: TaskStep[] } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: 'Researcher', role: 'researcher', status: 'idle' },
    { id: '2', name: 'Coder', role: 'coder', status: 'idle' },
    { id: '3', name: 'Analyzer', role: 'analyzer', status: 'idle' },
    { id: '4', name: 'Writer', role: 'writer', status: 'idle' },
  ]);
  const logRef = useRef<HTMLDivElement>(null);
  const [showApp, setShowApp] = useState(false);

  useEffect(() => { logRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [currentTask?.steps]);

  const startTask = useCallback(async () => {
    if (!task.trim()) return;
    setIsRunning(true);
    const steps: TaskStep[] = [
      { id: '1', name: 'Decompose Task', description: 'Analyze the goal and break it down', status: 'completed', agent: 'analyzer' },
      { id: '2', name: 'Research Phase', description: 'Gather relevant information', status: 'completed', agent: 'researcher' },
      { id: '3', name: 'Data Analysis', description: 'Process and analyze findings', status: 'running', agent: 'analyzer' },
      { id: '4', name: 'Report Generation', description: 'Create summary report', status: 'pending', agent: 'writer' },
      { id: '5', name: 'Final Review', description: 'Review and polish output', status: 'pending', agent: 'coder' },
    ];
    setCurrentTask({ goal: task, steps });
    setAgents(prev => prev.map(a => ({ ...a, status: 'idle' })));

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setCurrentTask(prev => prev ? { ...prev, steps: prev.steps.map((s, idx) => idx === i ? { ...s, status: 'running' as const } : s) } : null);
      setAgents(prev => prev.map(a => a.role === step.agent ? { ...a, status: 'working' as const, currentTask: step.name } : a));
      await new Promise(r => setTimeout(r, 2000));
      setCurrentTask(prev => prev ? { ...prev, steps: prev.steps.map((s, idx) => idx === i ? { ...s, status: 'completed' as const } : s) } : null);
      setAgents(prev => prev.map(a => a.role === step.agent ? { ...a, status: 'completed' as const } : a));
    }
    setIsRunning(false);
  }, [task]);

  const resetTask = useCallback(() => {
    setCurrentTask(null);
    setAgents(prev => prev.map(a => ({ ...a, status: 'idle' as const, currentTask: undefined })));
    setIsRunning(false);
  }, []);

  if (showApp) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg"><Bot className="h-5 w-5 text-white" /></div>
              <span className="font-bold">Autonomous Agent</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetTask} disabled={!currentTask}><RotateCcw className="h-4 w-4 mr-2" />Reset</Button>
              <Button variant="outline" size="sm" onClick={() => setShowApp(false)}>Back to Home</Button>
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-6">
          <Card className="mb-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Target className="h-5 w-5" />Task Goal</h2>
            <textarea value={task} onChange={(e) => setTask(e.target.value)}
              placeholder="Describe what you want the agents to accomplish..."
              disabled={isRunning}
              className="w-full h-24 p-4 bg-gray-950 border border-gray-700 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-gray-800" />
            <Button onClick={startTask} loading={isRunning} disabled={!task.trim() || isRunning} className="mt-4">
              <Play className="h-4 w-4 mr-2" />{currentTask ? 'Continue' : 'Start Task'}
            </Button>
          </Card>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <h2 className="font-semibold mb-4 flex items-center gap-2"><Users className="h-5 w-5" />Agents</h2>
              <div className="space-y-3">
                {agents.map(agent => (
                  <div key={agent.id} className={`p-3 rounded-lg border ${agent.status === 'working' ? 'border-blue-500 bg-blue-500/10' : agent.status === 'completed' ? 'border-green-500 bg-green-500/10' : 'border-gray-700 bg-gray-800'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className={`h-5 w-5 ${agent.status === 'working' ? 'text-blue-400 animate-pulse' : agent.status === 'completed' ? 'text-green-400' : 'text-gray-400'}`} />
                        <div><p className="font-medium">{agent.name}</p><p className="text-xs text-gray-500">{agent.currentTask || 'Ready'}</p></div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${agent.status === 'working' ? 'bg-blue-500/20 text-blue-400' : agent.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{agent.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="md:col-span-2">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><Activity className="h-5 w-5" />Task Progress</h2>
              {!currentTask ? (
                <div className="h-64 flex items-center justify-center text-gray-400"><Bot className="h-16 w-16 opacity-50" /><p className="mt-2">Enter a task and click "Start Task" to begin</p></div>
              ) : (
                <div className="space-y-4">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-violet-500 to-pink-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(currentTask.steps.filter(s => s.status === 'completed').length / currentTask.steps.length) * 100}%` }}></div>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-auto">
                    {currentTask.steps.map((step, index) => (
                      <div key={step.id} className={`p-4 rounded-lg border ${step.status === 'completed' ? 'border-green-500 bg-green-500/10' : step.status === 'running' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-gray-800'}`}>
                        <div className="flex items-center gap-3">
                          {step.status === 'completed' ? <CheckCircle2 className="h-5 w-5 text-green-400" /> : step.status === 'running' ? <Activity className="h-5 w-5 text-blue-400 animate-pulse" /> : <div className="h-5 w-5 rounded-full border-2 border-gray-500" />}
                          <div className="flex-1">
                            <div className="flex items-center gap-2"><span className="text-xs text-gray-500">Step {step.id}</span><span className="font-medium">{step.name}</span></div>
                            <p className="text-sm text-gray-400">{step.description}</p>
                          </div>
                          <span className="text-xs px-2 py-0.5 bg-gray-700 rounded capitalize">{step.agent}</span>
                        </div>
                      </div>
                    ))}
                    <div ref={logRef} />
                  </div>
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
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      <nav className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl"><Bot className="h-6 w-6 text-white" /></div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Autonomous Agent</span>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowApp(true)}><Play className="h-4 w-4 mr-2" />Try App</Button>
        </div>
      </nav>
      <section className="relative z-10 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm mb-8">
            <Sparkles className="h-4 w-4" /><span>Multi-Agent Orchestration</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-violet-200 to-pink-200 bg-clip-text text-transparent">Your AI Team</span>
            <br /><span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Works for You</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Deploy autonomous AI agents that research, analyze, and execute complex tasks.</p>
          <Button size="lg" onClick={() => setShowApp(true)} className="group">
            Deploy Agent<ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <span className="text-gray-400 text-sm">Autonomous Agent Orchestrator</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded flex items-center gap-1"><Activity className="h-3 w-3" />Running</span>
            </div>
            <div className="p-6 grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Task</div>
                <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl"><p className="text-sm text-violet-300">Research AI trends and create a summary report</p></div>
                <div className="mt-4 space-y-2">
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Agents</div>
                  {[{ name: 'Researcher', status: 'completed' }, { name: 'Coder', status: 'completed' }, { name: 'Analyzer', status: 'working' }, { name: 'Writer', status: 'pending' }].map((agent, i) => (
                    <div key={i} className={`p-3 rounded-lg border ${agent.status === 'completed' ? 'bg-green-500/10 border-green-500/20' : agent.status === 'working' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-gray-700 border-gray-600'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{agent.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${agent.status === 'completed' ? 'bg-green-500/20 text-green-400' : agent.status === 'working' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>{agent.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 space-y-3">
                <div className="text-xs text-pink-400 mb-2 uppercase tracking-wider flex items-center gap-2"><Sparkles className="h-3 w-3" />Execution Progress</div>
                <div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-gradient-to-r from-violet-500 to-pink-500 h-2 rounded-full" style={{ width: '60%' }}></div></div>
                {[{ step: '1', name: 'Decompose Task', status: 'completed' }, { step: '2', name: 'Research Phase', status: 'completed' }, { step: '3', name: 'Data Analysis', status: 'completed' }, { step: '4', name: 'Report Generation', status: 'working' }, { step: '5', name: 'Final Review', status: 'pending' }].map((item, i) => (
                  <div key={i} className={`p-3 rounded-lg border ${item.status === 'completed' ? 'bg-green-500/10 border-green-500/20' : item.status === 'working' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-gray-700 border-gray-600'}`}>
                    <div className="flex items-center gap-3">
                      {item.status === 'completed' ? <CheckCircle2 className="h-5 w-5 text-green-400" /> : item.status === 'working' ? <Activity className="h-5 w-5 text-blue-400 animate-pulse" /> : <div className="h-5 w-5 rounded-full border-2 border-gray-500" />}
                      <div className="flex-1"><div className="flex items-center gap-2"><span className="text-xs text-gray-500">Step {item.step}</span><span className="text-sm text-gray-300">{item.name}</span></div></div>
                      {item.status === 'working' && <span className="text-xs text-blue-400">Working...</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative p-12 bg-gradient-to-r from-violet-600 to-pink-600 rounded-3xl overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Automate?</h2>
            <p className="text-violet-100 mb-8">Let your AI team handle complex tasks.</p>
            <Button size="lg" variant="secondary" onClick={() => setShowApp(true)} className="group">
              Deploy Agent<ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
export default App;
