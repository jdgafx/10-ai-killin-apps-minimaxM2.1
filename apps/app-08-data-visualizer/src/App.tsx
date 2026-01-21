import React, { useState, useCallback, useEffect } from 'react';
import { useAIProvider } from '@packages/ai-providers';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from '@packages/shared-ui';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Lightbulb, 
  Upload, 
  Download,
  RefreshCw,
  FileJson,
  Sparkles
} from 'lucide-react';

interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'area';
  title: string;
  xKey: string;
  yKeys: string[];
  colors: string[];
}

interface Insight {
  type: 'trend' | 'outlier' | 'correlation' | 'summary';
  title: string;
  description: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const CHART_TYPES = [
  { id: 'line', name: 'Line Chart', icon: TrendingUp },
  { id: 'bar', name: 'Bar Chart', icon: BarChart3 },
  { id: 'area', name: 'Area Chart', icon: Sparkles },
  { id: 'scatter', name: 'Scatter Plot', icon: TrendingUp },
  { id: 'pie', name: 'Pie Chart', icon: PieChart },
];

function App() {
  const [data, setData] = useState<string>('[{"month": "Jan", "sales": 4000, "revenue": 2400}, {"month": "Feb", "sales": 3000, "revenue": 1398}, {"month": "Mar", "sales": 2000, "revenue": 9800}, {"month": "Apr", "sales": 2780, "revenue": 3908}, {"month": "May", "sales": 1890, "revenue": 4800}, {"month": "Jun", "sales": 2390, "revenue": 3800}]');
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'scatter' | 'area'>('line');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { chat, isLoading } = useAIProvider();

  useEffect(() => {
    try {
      const parsed = JSON.parse(data);
      setParsedData(parsed);
    } catch {
      // Invalid JSON, will show error on analyze
    }
  }, [data]);

  const generateInsights = useCallback(async () => {
    if (!parsedData.length) {
      setError('Please enter valid JSON data');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const systemPrompt = `Analyze this data and provide insights. Return JSON:
{
  "insights": [
    {
      "type": "trend" | "outlier" | "correlation" | "summary",
      "title": "<insight title>",
      "description": "<detailed explanation>"
    }
  ],
  "recommendedChart": "line" | "bar" | "pie" | "scatter" | "area",
  "keyFindings": ["<finding 1>", "<finding 2>"]
}`;

      const result = await chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Data:\n${JSON.stringify(parsedData, null, 2)}` },
      ]);

      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setInsights(parsed.insights || []);
        if (parsed.recommendedChart) {
          setChartType(parsed.recommendedChart);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze data');
    } finally {
      setIsAnalyzing(false);
    }
  }, [parsedData, chat]);

  const renderChart = useCallback(() => {
    if (!parsedData.length) return null;

    const xKey = Object.keys(parsedData[0])[0];
    const yKeys = Object.keys(parsedData[0]).slice(1);

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={parsedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {yKeys.map((key, i) => (
                <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={parsedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {yKeys.map((key, i) => (
                <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={parsedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {yKeys.map((key, i) => (
                <Area key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.3} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} type="category" name={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {yKeys.map((key, i) => (
                <Scatter key={key} name={key} data={parsedData} fill={COLORS[i % COLORS.length]} />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        );
      case 'pie':
        const pieData = parsedData.map((item, i) => ({
          name: item[xKey],
          value: Object.values(item).slice(1).reduce((a: any, b: any) => a + b, 0),
        }));
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: { name?: string; percent?: number }) => `${name || 'Unknown'}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  }, [parsedData, chartType]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Data Visualizer</h1>
              <p className="text-sm text-gray-500">AI-powered data insights and charting</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Data Input */}
          <Card className="lg:col-span-1 h-fit">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              Data Input
            </h2>
            <textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="Enter JSON data..."
              className="w-full h-64 p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={generateInsights} loading={isAnalyzing} disabled={!parsedData.length} className="mt-4 w-full">
              <Lightbulb className="h-4 w-4 mr-2" />
              Analyze & Visualize
            </Button>
          </Card>

          {/* Chart */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Chart</h2>
              <div className="flex gap-1">
                {CHART_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setChartType(type.id as any)}
                      className={`p-2 rounded-lg transition-colors ${
                        chartType === type.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={type.name}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </div>
            {parsedData.length > 0 ? (
              <div className="w-full overflow-auto">
                {renderChart()}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                <p>Enter valid JSON data to visualize</p>
              </div>
            )}
          </Card>

          {/* AI Insights */}
          {insights.length > 0 && (
            <Card className="lg:col-span-3">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                AI Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {insights.map((insight, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg border-l-4 ${
                      insight.type === 'trend' ? 'border-l-green-500 bg-green-50' :
                      insight.type === 'outlier' ? 'border-l-red-500 bg-red-50' :
                      insight.type === 'correlation' ? 'border-l-blue-500 bg-blue-50' :
                      'border-l-gray-500 bg-gray-50'
                    }`}
                  >
                    <h3 className="font-medium text-gray-800 mb-1">{insight.title}</h3>
                    <p className="text-sm text-gray-600">{insight.description}</p>
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

export default App;
