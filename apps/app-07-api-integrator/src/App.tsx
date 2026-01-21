import React, { useState, useCallback } from 'react'
import {
  Plug,
  Sparkles,
  ChevronRight,
  Activity,
  Database,
  Globe,
  Terminal,
  Zap,
  Shield,
  Layers,
  Code2,
  CheckCircle,
  Play,
  X,
} from 'lucide-react'
import { Card, Button, Input } from './lib/components'

interface Endpoint {
  id: string
  name: string
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  status?: number
  latency?: number
}

function App() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([
    {
      id: '1',
      name: 'Users API',
      url: 'https://api.example.com/users',
      method: 'GET',
      status: 200,
      latency: 142,
    },
    {
      id: '2',
      name: 'Posts API',
      url: 'https://api.example.com/posts',
      method: 'GET',
      status: 200,
      latency: 89,
    },
    {
      id: '3',
      name: 'Auth API',
      url: 'https://api.example.com/auth',
      method: 'POST',
      status: 201,
      latency: 234,
    },
  ])
  const [newEndpoint, setNewEndpoint] = useState({ name: '', url: '', method: 'GET' as const })
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null)
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showApp, setShowApp] = useState(false)

  const testEndpoint = useCallback(async (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint)
    setIsLoading(true)
    setResponse('')

    try {
      // Make actual API call
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)

      const fetchOptions: RequestInit = {
        method: endpoint.method,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      // Add body for POST/PUT
      if (endpoint.method === 'POST' || endpoint.method === 'PUT') {
        fetchOptions.body = JSON.stringify({ timestamp: new Date().toISOString() })
      }

      const startTime = Date.now()
      const res = await fetch(endpoint.url, fetchOptions)
      const latency = Date.now() - startTime
      clearTimeout(timeout)

      let responseData
      const contentType = res.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        responseData = await res.json()
      } else {
        responseData = await res.text()
      }

      setResponse(
        JSON.stringify(
          {
            status: res.status,
            statusText: res.statusText,
            latency: `${latency}ms`,
            headers: Object.fromEntries(res.headers.entries()),
            data: responseData,
          },
          null,
          2,
        ),
      )

      // Update endpoint with real results
      setEndpoints((prev) =>
        prev.map((ep) => (ep.id === endpoint.id ? { ...ep, status: res.status, latency } : ep)),
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setResponse(
        JSON.stringify(
          {
            error: true,
            message: errorMessage,
            note: 'This may be a CORS issue or invalid URL. For demo purposes, showing simulated response.',
            simulatedData: {
              status: 200,
              message: 'Success',
              data: { id: 1, name: 'Test Data', timestamp: new Date().toISOString() },
            },
          },
          null,
          2,
        ),
      )
    }

    setIsLoading(false)
  }, [])

  const addEndpoint = useCallback(() => {
    if (!newEndpoint.name || !newEndpoint.url) return
    setEndpoints((prev) => [...prev, { ...newEndpoint, id: Date.now().toString() }])
    setNewEndpoint({ name: '', url: '', method: 'GET' })
  }, [newEndpoint])

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-500/20 text-green-400'
      case 'POST':
        return 'bg-blue-500/20 text-blue-400'
      case 'PUT':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'DELETE':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  if (showApp) {
    return (
      <div className="min-h-screen bg-[#0f0f12] text-white">
        <header className="bg-[#16161d] border-b border-white/5 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <Plug className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">API Integrator</h1>
                <p className="text-xs text-gray-400">Powered by MiniMax AI</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowApp(false)}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="bg-[#16161d] border-white/5">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-orange-400" />
                  <span className="text-sm font-medium">Endpoints</span>
                </div>
                <span className="text-xs text-gray-500">{endpoints.length} total</span>
              </div>
              <div className="p-4 space-y-2 max-h-96 overflow-auto">
                {endpoints.map((ep) => (
                  <div
                    key={ep.id}
                    onClick={() => testEndpoint(ep)}
                    className={`p-3 rounded-lg cursor-pointer border transition-all ${
                      selectedEndpoint?.id === ep.id
                        ? 'bg-orange-500/10 border-orange-500/50'
                        : 'bg-[#1a1a24] hover:bg-[#252530] border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{ep.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getMethodColor(ep.method)}`}>
                        {ep.method}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-1">{ep.url}</p>
                    {ep.status && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-green-400">{ep.status} OK</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-400">{ep.latency}ms</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-white/5 space-y-3">
                <input
                  type="text"
                  value={newEndpoint.name}
                  onChange={(e) => setNewEndpoint((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Endpoint name..."
                  className="w-full px-3 py-2 bg-[#1a1a24] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
                <input
                  type="text"
                  value={newEndpoint.url}
                  onChange={(e) => setNewEndpoint((prev) => ({ ...prev, url: e.target.value }))}
                  placeholder="API URL..."
                  className="w-full px-3 py-2 bg-[#1a1a24] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
                <select
                  value={newEndpoint.method}
                  onChange={(e) =>
                    setNewEndpoint((prev) => ({ ...prev, method: e.target.value as any }))
                  }
                  className="w-full px-3 py-2 bg-[#1a1a24] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
                <Button
                  onClick={addEndpoint}
                  disabled={!newEndpoint.name || !newEndpoint.url}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500"
                >
                  <Plug className="h-4 w-4 mr-2" />
                  Add Endpoint
                </Button>
              </div>
            </Card>

            <Card className="lg:col-span-2 bg-[#16161d] border-white/5">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-orange-400" />
                  <span className="text-sm font-medium">Response</span>
                </div>
                {selectedEndpoint && (
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                    {selectedEndpoint.method} {selectedEndpoint.url}
                  </span>
                )}
              </div>
              <div className="p-4">
                {selectedEndpoint ? (
                  <>
                    <div className="flex items-center gap-4 p-3 bg-[#1a1a24] rounded-lg mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${getMethodColor(selectedEndpoint.method)}`}
                        >
                          {selectedEndpoint.method}
                        </span>
                        <span className="text-sm text-gray-300">{selectedEndpoint.name}</span>
                      </div>
                      <div className="flex items-center gap-4 ml-auto">
                        {selectedEndpoint.status && (
                          <span className="text-xs text-green-400">
                            Status: {selectedEndpoint.status}
                          </span>
                        )}
                        {selectedEndpoint.latency && (
                          <span className="text-xs text-gray-400">
                            Latency: {selectedEndpoint.latency}ms
                          </span>
                        )}
                      </div>
                    </div>
                    {isLoading ? (
                      <div className="h-64 flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                          <p className="text-sm text-gray-400 mt-4">Testing endpoint...</p>
                        </div>
                      </div>
                    ) : response ? (
                      <pre className="bg-[#1a1a24] text-orange-300 p-4 rounded-xl text-sm overflow-auto max-h-96 font-mono">
                        {response}
                      </pre>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-gray-400">
                        <Activity className="h-16 w-16 mx-auto opacity-50" />
                        <p className="mt-2">Click an endpoint to test</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <Activity className="h-16 w-16 mx-auto opacity-50" />
                    <p className="mt-2">Select an endpoint to test</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/10 via-[#0f0f12] to-red-900/10"></div>
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      <nav className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
              <Plug className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              API Integrator
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

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Connect, test, and integrate any API in seconds.
          </p>

          <Button size="lg" onClick={() => setShowApp(true)} className="group">
            Start Testing
            <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-[#16161d]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <span className="text-gray-400 text-sm">API Integrator</span>
              <Button size="sm" onClick={() => setShowApp(true)}>
                Try It →
              </Button>
            </div>
            <div className="p-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                    Endpoint
                  </div>
                  <div className="p-3 bg-[#1a1a24] rounded-lg mb-4">
                    <span className="text-green-400 font-mono text-sm">
                      https://api.example.com/users
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                    Response
                  </div>
                  <pre className="text-sm font-mono text-orange-300 overflow-x-auto bg-[#1a1a24] p-4 rounded-xl">
                    <code>{`{
  "status": 200,
  "message": "Success",
  "data": { "id": 1, "name": "Test Data" }
}`}</code>
                  </pre>
                </div>
                <div className="space-y-3">
                  <div className="text-xs text-red-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />
                    AI Analysis
                  </div>
                  {['✓ Status 200 OK', '✓ Response Time: 142ms', '✓ Data Validation'].map(
                    (item, i) => (
                      <div
                        key={i}
                        className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-sm text-green-400">{item}</span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative p-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Integrate?</h2>
            <p className="text-orange-100 mb-8">Test APIs like a pro today.</p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setShowApp(true)}
              className="group"
            >
              Launch App
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
