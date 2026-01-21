import React, { useState, useCallback } from 'react';
import { Plug, Sparkles, ArrowRight, Activity, Database, Globe, Terminal, Zap, Shield, Layers, Code2, CheckCircle2, Play, X } from 'lucide-react';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from './lib/components';

interface Endpoint { id: string; name: string; url: string; method: string; }

function App() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([
    { id: '1', name: 'Users API', url: 'https://api.example.com/users', method: 'GET' },
    { id: '2', name: 'Posts API', url: 'https://api.example.com/posts', method: 'GET' },
  ]);
  const [newEndpoint, setNewEndpoint] = useState({ name: '', url: '', method: 'GET' });
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showApp, setShowApp] = useState(false);

  const testEndpoint = useCallback(async (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint);
    setIsLoading(true);
    setResponse('');
    await new Promise(r => setTimeout(r, 1500));
    setResponse(JSON.stringify({ status: 200, message: 'Success', data: { id: 1, name: 'Test Data', timestamp: new Date().toISOString() } }, null, 2));
    setIsLoading(false);
  }, []);

  const addEndpoint = useCallback(() => {
    if (!newEndpoint.name || !newEndpoint.url) return;
    setEndpoints(prev => [...prev, { ...newEndpoint, id: Date.now().toString() }]);
    setNewEndpoint({ name: '', url: '', method: 'GET' });
  }, [newEndpoint]);

  if (showApp) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg"><Plug className="h-5 w-5 text-white" /></div>
              <span className="font-bold">API Integrator</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowApp(false)}>Back to Home</Button>
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><Database className="h-5 w-5" />Endpoints</h2>
              <div className="space-y-2 mb-4">
                {endpoints.map(ep => (
                  <div key={ep.id} onClick={() => testEndpoint(ep)} className={`p-3 rounded-lg cursor-pointer border transition-colors ${selectedEndpoint?.id === ep.id ? 'bg-blue-50 border-blue-300' : 'bg-gray-800 hover:bg-gray-700'}`}>
                    <div className="flex items-center justify-between"><span className="font-medium">{ep.name}</span><span className={`text-xs px-2 py-0.5 rounded ${ep.method === 'GET' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{ep.method}</span></div>
                    <p className="text-xs text-gray-500 truncate">{ep.url}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t border-gray-700 pt-4">
                <Input value={newEndpoint.name} onChange={(value) => setNewEndpoint(prev => ({ ...prev, name: value }))} placeholder="Endpoint name..." />
                <Input value={newEndpoint.url} onChange={(value) => setNewEndpoint(prev => ({ ...prev, url: value }))} placeholder="API URL..." />
                <select value={newEndpoint.method} onChange={(e) => setNewEndpoint(prev => ({ ...prev, method: e.target.value }))} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                  <option value="GET">GET</option><option value="POST">POST</option><option value="PUT">PUT</option><option value="DELETE">DELETE</option>
                </select>
                <Button onClick={addEndpoint} className="w-full"><Plug className="h-4 w-4 mr-2" />Add Endpoint</Button>
              </div>
            </Card>
            <Card className="md:col-span-2">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><Activity className="h-5 w-5" />Response</h2>
              {selectedEndpoint ? (
                <>
                  <div className="mb-4 p-3 bg-gray-800 rounded-lg"><p className="font-medium">{selectedEndpoint.name}</p><p className="text-sm text-gray-400">{selectedEndpoint.method} {selectedEndpoint.url}</p></div>
                  {isLoading ? <div className="h-64 flex items-center justify-center"><LoadingSpinner /></div> : response ? (
                    <pre className="bg-gray-950 text-orange-300 p-4 rounded-lg text-sm overflow-auto max-h-96">{response}</pre>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-400"><Activity className="h-16 w-16 opacity-50" /><p className="mt-2">Click an endpoint to test</p></div>
                  )}
                </>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400"><Activity className="h-16 w-16 opacity-50" /><p className="mt-2">Select an endpoint to test</p></div>
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
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-red-900/20 to-pink-900/20"></div>
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      <nav className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl"><Plug className="h-6 w-6 text-white" /></div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">API Integrator</span>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowApp(true)}><Play className="h-4 w-4 mr-2" />Try App</Button>
        </div>
      </nav>
      <section className="relative z-10 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm mb-8">
            <Sparkles className="h-4 w-4" /><span>AI-Powered API Testing</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-orange-200 to-red-200 bg-clip-text text-transparent">Test APIs</span>
            <br /><span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Like a Pro</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Connect, test, and integrate any API in seconds.</p>
          <Button size="lg" onClick={() => setShowApp(true)} className="group">
            Start Testing<ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <span className="text-gray-400 text-sm">API Integrator</span>
              <Button size="sm" onClick={() => setShowApp(true)}>Try It →</Button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Endpoint</div>
                  <div className="p-3 bg-gray-800 rounded-lg mb-4"><span className="text-green-400 font-mono text-sm">https://api.example.com/users</span></div>
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Response</div>
                  <pre className="text-sm font-mono text-orange-300 overflow-x-auto bg-gray-800 p-4 rounded-lg"><code>{`{
  "status": 200,
  "message": "Success",
  "data": { "id": 1, "name": "Test Data" }
}`}</code></pre>
                </div>
                <div className="space-y-3">
                  <div className="text-xs text-red-400 mb-2 uppercase tracking-wider flex items-center gap-2"><Sparkles className="h-3 w-3" />AI Analysis</div>
                  {['✓ Status 200 OK', '✓ Response Time: 142ms', '✓ Data Validation'].map((item, i) => (
                    <div key={i} className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-400" /><span className="text-sm text-green-400">{item}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative p-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Integrate?</h2>
            <p className="text-orange-100 mb-8">Test APIs like a pro today.</p>
            <Button size="lg" variant="secondary" onClick={() => setShowApp(true)} className="group">
              Launch App<ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
export default App;
