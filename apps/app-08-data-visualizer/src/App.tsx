import React, { useState, useCallback } from 'react';
import { BarChart3, Sparkles, ChevronRight, TrendingUp, Lightbulb, DollarSign, Zap, Target, Clock, Globe, Layers, RefreshCw, Play } from 'lucide-react';
import { Card, Button, Input } from './lib/components';

function App() {
  const [data, setData] = useState('[{"month": "Jan", "sales": 4000, "revenue": 2400}, {"month": "Feb", "sales": 3000, "revenue": 1398}, {"month": "Mar", "sales": 2000, "revenue": 9800}]');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [showApp, setShowApp] = useState(false);

  const chartData = [
    { label: 'Jan', sales: 40, revenue: 24 },
    { label: 'Feb', sales: 30, revenue: 14 },
    { label: 'Mar', sales: 20, revenue: 98 },
    { label: 'Apr', sales: 70, revenue: 43 },
    { label: 'May', sales: 50, revenue: 30 },
    { label: 'Jun', sales: 90, revenue: 55 },
  ];

  const analyzeData = useCallback(async () => {
    setIsAnalyzing(true);
    setInsights([]);
    await new Promise(r => setTimeout(r, 2000));
    setInsights([
      '✓ Strong upward trend in March revenue (+600%)',
      '✓ Revenue-to-sales ratio improved to 2.4x',
      '✓ Peak performance expected in Q2',
      '✓ Consider expanding inventory for top performers'
    ]);
    setIsAnalyzing(false);
  }, []);

  const getBarHeight = (value: number) => `${value * 3.5}px`;

  if (showApp) {
    return (
      <div className="min-h-screen bg-[#0f0f12] text-white">
        <header className="bg-[#16161d] border-b border-white/5 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">Data Visualizer</h1>
                <p className="text-xs text-gray-400">Powered by MiniMax AI</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowApp(false)}>
              <Play className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="bg-[#16161d] border-white/5">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-medium">Data Input</span>
                </div>
              </div>
              <div className="p-4">
                <textarea
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full h-48 font-mono text-sm bg-[#1a1a24] text-indigo-300 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="Enter JSON data..."
                />
                <div className="flex gap-2 mt-4">
                  {(['bar', 'line', 'area'] as const).map(type => (
                    <Button
                      key={type}
                      variant={chartType === type ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setChartType(type)}
                      className="flex-1"
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
                <Button onClick={analyzeData} loading={isAnalyzing} className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-500">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Analyze & Visualize
                </Button>
              </div>
            </Card>

            <Card className="lg:col-span-2 bg-[#16161d] border-white/5">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-medium">Chart</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-green-400">Live Preview</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-end justify-center gap-4 h-64 p-4 bg-[#1a1a24] rounded-xl">
                  {chartData.map((item, i) => {
                    const barClass = chartType === 'bar' 
                      ? `bg-gradient-to-t from-indigo-500 to-purple-500`
                      : chartType === 'line'
                      ? 'h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500'
                      : 'h-32 bg-gradient-to-t from-indigo-500 to-purple-500 opacity-50';
                    return (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div 
                          className={`${barClass} rounded-t-lg transition-all duration-500`}
                          style={{ 
                            height: chartType === 'bar' ? getBarHeight(item.sales) : undefined,
                            width: chartType === 'line' ? '64px' : undefined,
                            minHeight: chartType === 'area' ? '32px' : undefined
                          }}
                        ></div>
                        <span className="text-xs text-gray-400">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                  {[
                    { label: 'Total Sales', value: '$300K', color: 'text-indigo-400' },
                    { label: 'Revenue', value: '$264K', color: 'text-purple-400' },
                    { label: 'Growth', value: '+24%', color: 'text-green-400' },
                    { label: 'Avg Order', value: '$880', color: 'text-amber-400' },
                  ].map((stat, i) => (
                    <div key={i} className="p-3 bg-[#1a1a24] rounded-lg text-center">
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {insights.length > 0 && (
              <Card className="lg:col-span-3 bg-[#16161d] border-white/5">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm font-medium">AI Insights</span>
                  </div>
                </div>
                <div className="p-4 grid md:grid-cols-2 gap-4">
                  {insights.map((insight, i) => (
                    <div key={i} className="p-4 bg-indigo-500/10 border-l-4 border-indigo-500 rounded-r-lg">
                      <p className="text-sm text-gray-300">{insight}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-[#0f0f12] to-purple-900/10"></div>
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <nav className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Data Visualizer
            </span>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowApp(true)}>
            <Play className="h-4 w-4 mr-2" />
            Try App
          </Button>
        </div>
      </nav>

      <section className="relative z-10 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm mb-8">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Analytics</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">See Your Data</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Like Never Before</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Transform data into stunning visualizations with AI insights.</p>
          
          <Button size="lg" onClick={() => setShowApp(true)} className="group">
            Start Visualizing
            <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="mt-20 max-w-5xl mx-auto">
          <div className="bg-[#16161d]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <span className="text-gray-400 text-sm">ROI Analysis Dashboard</span>
              <Button size="sm" onClick={() => setShowApp(true)}>Try It →</Button>
            </div>
            <div className="p-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#1a1a24]/50 rounded-xl p-6">
                  <div className="flex items-end justify-center gap-4 h-48">
                    {chartData.map((item, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div 
                          className="w-12 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg transition-all duration-500"
                          style={{ height: `${item.sales * 1.5}px` }}
                        ></div>
                        <span className="text-gray-400 text-xs">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-xs text-purple-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />AI Insights
                  </div>
                  {['✓ Strong Growth: 65% revenue increase', '✓ ROI: +50%', '✓ Key Finding: 4x value at 2x cost'].map((item, i) => (
                    <div key={i} className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-indigo-400" />
                        <span className="text-sm text-indigo-400">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative p-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See Your Data Clearly</h2>
            <p className="text-indigo-100 mb-8">Get insights that matter.</p>
            <Button size="lg" variant="secondary" onClick={() => setShowApp(true)} className="group">
              Launch App
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
