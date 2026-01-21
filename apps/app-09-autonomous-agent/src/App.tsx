import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useAIProvider } from '@packages/ai-providers';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from '@packages/shared-ui';
import { 
  Bot, 
  Cpu, 
  Target, 
  Activity, 
  CheckCircle, 
  Clock,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Users,
  Zap
} from 'lucide-react';

interface TaskStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  result?: string;
  duration?: number;
  agent: string;
}

interface Agent {
  id: string;
  name: string;
  role: 'researcher' | 'coder' | 'analyzer' | 'writer';
  status: 'idle' | 'working' | 'completed';
  currentTask?: string;
}

interface Task {
  id: string;
  goal: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  steps: TaskStep[];
  createdAt: Date;
  completedAt?: Date;
  result?: string;
}

const AGENTS: { id: string; name: string; role: 'researcher' | 'coder' | 'analyzer' | 'writer'; description: string }[] = [
  { id: 'researcher', name: 'Researcher', role: 'researcher', description: 'Searches and gathers information' },
  { id: 'coder', name: 'Coder', role: 'coder', description: 'Writes and reviews code' },
  { id: 'analyzer', name: 'Analyzer', role: 'analyzer', description: 'Analyzes data and patterns' },
  { id: 'writer', name: 'Writer', role: 'writer', description: 'Synthesizes and documents' },
];

function App() {
  const [task, setTask] = useState<string>('Research the latest trends in AI and create a summary report');
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [agents, setAgents] = useState<Agent[]>(AGENTS.map(a => ({ ...a, status: 'idle' as const })));
  const [error, setError] = useState<string | null>(null);

  const logRef = useRef<HTMLDivElement>(null);
  const { chat, isLoading } = useAIProvider();

  useEffect(() => {
    logRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentTask?.steps]);

  const decomposeTask = useCallback(async (goal: string): Promise<TaskStep[]> => {
    const result = await chat([
      { role: 'system', content: `You are a task decomposition expert. Break down the given goal into clear, actionable steps. 
Return a JSON array:
[
  {
    "name": "<step name>",
    "description": "<what to do>",
    "agent": "researcher" | "coder" | "analyzer" | "writer"
  }
]` },
      { role: 'user', content: `Goal: ${goal}` },
    ]);

    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [
      { id: 'fallback-0', name: 'Analyze', description: 'Analyze the goal', status: 'pending' as const, agent: 'analyzer' },
      { id: 'fallback-1', name: 'Research', description: 'Research relevant information', status: 'pending' as const, agent: 'researcher' },
      { id: 'fallback-2', name: 'Execute', description: 'Execute the task', status: 'pending' as const, agent: 'coder' },
      { id: 'fallback-3', name: 'Document', description: 'Document the results', status: 'pending' as const, agent: 'writer' },
    ];
  }, [chat]);

  const executeStep = useCallback(async (step: TaskStep): Promise<string> => {
    const result = await chat([
      { role: 'system', content: `You are a ${step.agent} agent. Execute the task thoroughly and provide detailed results.` },
      { role: 'user', content: `${step.description}\n\nGoal: ${task}\n\nProvide your complete output:` },
    ]);
    return result;
  }, [chat, task]);

  const startTask = useCallback(async () => {
    if (!task.trim()) {
      setError('Please enter a task goal');
      return;
    }

    setIsRunning(true);
    setError(null);

    const steps = await decomposeTask(task);
    const initialTask: Task = {
      id: crypto.randomUUID(),
      goal: task,
      status: 'running',
      steps: steps.map((s, i) => ({
        ...s,
        id: `step-${i}`,
        status: 'pending' as const,
      })),
      createdAt: new Date(),
    };

    setCurrentTask(initialTask);
    setAgents((prev) => prev.map((a) => ({ ...a, status: 'idle' as const })));

    // Execute steps sequentially
    for (let i = 0; i < initialTask.steps.length; i++) {
      const step = initialTask.steps[i];
      
      // Update step status to running
      setCurrentTask((prev) => prev ? {
        ...prev,
        steps: prev.steps.map((s, idx) => idx === i ? { ...s, status: 'running' as const } : s),
      } : null);

      // Update agent status
      setAgents((prev) => prev.map((a) =>
        a.role === step.agent ? { ...a, status: 'working' as const, currentTask: step.name } : a
      ));

      const startTime = Date.now();
      try {
        const result = await executeStep(step);
        const duration = Date.now() - startTime;

        setCurrentTask((prev) => prev ? {
          ...prev,
          steps: prev.steps.map((s, idx) =>
            idx === i
              ? { ...s, status: 'completed' as const, result, duration }
              : s
          ),
        } : null);

        setAgents((prev) => prev.map((a) =>
          a.role === step.agent ? { ...a, status: 'completed' as const } : a
        ));
      } catch (err) {
        setCurrentTask((prev) => prev ? {
          ...prev,
          steps: prev.steps.map((s, idx) =>
            idx === i ? { ...s, status: 'error' as const } : s
          ),
        } : null);
      }
    }

    // Complete task
    const finalResult = await chat([
      { role: 'system', content: 'You are a task completion summarizer. Provide a concise summary of the completed work.' },
      { role: 'user', content: `The following tasks were completed:\n${initialTask.steps.map((s, i) => `${i + 1}. ${s.name}: ${s.result?.substring(0, 100)}...`).join('\n')}\n\nProvide a final summary:` },
    ]);

    setCurrentTask((prev) => prev ? ({
      ...prev,
      status: 'completed',
      completedAt: new Date(),
      result: finalResult,
    }) : null);

    setAgents((prev) => prev.map((a) => ({ ...a, status: 'idle' as const })));
    setIsRunning(false);
  }, [task, decomposeTask, executeStep, chat]);

  const resetTask = useCallback(() => {
    setCurrentTask(null);
    setAgents((prev) => prev.map((a) => ({ ...a, status: 'idle' as const })));
    setIsRunning(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Autonomous Agent</h1>
              <p className="text-sm text-gray-500">Multi-agent orchestration system</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetTask} disabled={!currentTask}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={startTask} loading={isLoading || isRunning} disabled={!task.trim() || isRunning}>
              <Play className="h-4 w-4 mr-2" />
              {currentTask ? 'Continue' : 'Start Task'}
            </Button>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <ErrorAlert message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Task Input */}
        <Card className="mb-6">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Task Goal
          </h2>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Describe what you want the agents to accomplish..."
            disabled={isRunning}
            className="w-full h-24 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-100"
          />
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agents Status */}
          <Card>
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Agents
            </h2>
            <div className="space-y-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`p-3 rounded-lg border ${
                    agent.status === 'working'
                      ? 'border-blue-300 bg-blue-50'
                      : agent.status === 'completed'
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className={`h-5 w-5 ${
                        agent.status === 'working' ? 'text-blue-600 animate-pulse' :
                        agent.status === 'completed' ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-800">{agent.name}</p>
                        <p className="text-xs text-gray-500">{agent.currentTask || 'Ready'}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      agent.status === 'working' ? 'bg-blue-200 text-blue-700' :
                      agent.status === 'completed' ? 'bg-green-200 text-green-700' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Task Progress */}
          <Card className="lg:col-span-2">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Task Progress
            </h2>
            {!currentTask ? (
              <div className="h-64 flex items-center justify-center text-gray-400">
                <p>Enter a task and click "Start Task" to begin</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(currentTask.steps.filter(s => s.status === 'completed').length / currentTask.steps.length) * 100}%`
                    }}
                  />
                </div>

                {/* Steps */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {currentTask.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`p-4 rounded-lg border ${
                        step.status === 'completed'
                          ? 'border-green-300 bg-green-50'
                          : step.status === 'running'
                          ? 'border-blue-300 bg-blue-50'
                          : step.status === 'error'
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {step.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : step.status === 'running' ? (
                          <Activity className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5 animate-pulse" />
                        ) : step.status === 'error' ? (
                          <Activity className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-800">{step.name}</span>
                            <span className="text-xs px-2 py-0.5 bg-gray-200 rounded capitalize">{step.agent}</span>
                          </div>
                          <p className="text-sm text-gray-600">{step.description}</p>
                          {step.result && (
                            <div className="mt-2 p-2 bg-white rounded border text-sm text-gray-700">
                              {step.result.substring(0, 150)}...
                            </div>
                          )}
                          {step.duration && (
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {step.duration}ms
                            </p>
                          )}
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Final Result */}
                {currentTask.result && (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h3 className="font-medium text-purple-800 mb-2">Final Result</h3>
                    <p className="text-gray-700">{currentTask.result}</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}

export default App;
