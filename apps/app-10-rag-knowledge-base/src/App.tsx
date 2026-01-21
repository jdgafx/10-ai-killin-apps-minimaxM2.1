import React, { useState, useCallback, useEffect, useRef } from 'react'
import {
  BookOpen,
  Sparkles,
  ChevronRight,
  Search,
  FileText,
  Brain,
  Zap,
  Shield,
  Clock,
  Globe,
  Layers,
  Upload,
  Database,
  Play,
  X,
  RefreshCw,
} from 'lucide-react'
import { Card, Button, Input } from './lib/components'

interface Document {
  id: string
  name: string
  content: string
  tags: string[]
  chunks: number
}
interface SearchResult {
  documentId: string
  title: string
  chunk: string
  relevance: number
}

function App() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isIndexing, setIsIndexing] = useState(false)
  const [showApp, setShowApp] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateEmbedding = useCallback(async (text: string): Promise<number[]> => {
    const chars = text.toLowerCase().split('')
    const embedding = new Array(100).fill(0)
    chars.forEach((char, i) => {
      embedding[char.charCodeAt(0) % 100] += 1
    })
    const norm = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0)) || 1
    return embedding.map((v) => v / norm)
  }, [])

  const cosineSimilarity = (a: number[], b: number[]): number => {
    const dot = a.reduce((sum, v, i) => sum + v * b[i], 0)
    const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0)) || 1
    const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0)) || 1
    return dot / (normA * normB)
  }

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return
    setIsIndexing(true)
    for (const file of Array.from(files)) {
      const text = await file.text()
      const chunks = text.split(/\n\n+/).filter((c: string) => c.length > 50)
      const doc: Document = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        content: text,
        tags: ['uploaded'],
        chunks: chunks.length,
      }
      setDocuments((prev) => [...prev, doc])
    }
    setIsIndexing(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  const performSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    setIsSearching(true)

    // Get relevant chunks and use AI for better answers
    const queryEmbedding = await generateEmbedding(searchQuery)
    const results: SearchResult[] = []

    for (const doc of documents) {
      const chunks = doc.content.split(/\n\n+/).filter((c: string) => c.length > 50)
      for (let i = 0; i < chunks.length; i++) {
        const chunkEmbedding = await generateEmbedding(chunks[i])
        const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding)
        if (similarity > 0.1) {
          results.push({
            documentId: doc.id,
            title: doc.name,
            chunk: chunks[i].substring(0, 300) + (chunks[i].length > 300 ? '...' : ''),
            relevance: similarity,
          })
        }
      }
    }
    results.sort((a, b) => b.relevance - a.relevance)

    // Use AI to provide better answers for top results
    if (results.length > 0 && searchQuery.length > 10) {
      try {
        const context = results
          .slice(0, 3)
          .map((r) => r.chunk)
          .join('\n\n')
        const response = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer sk-dee6a5873cb1471b8ed2be7f1303359d',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content:
                  'You are a document Q&A assistant. Provide concise answers based on the context.',
              },
              {
                role: 'user',
                content: `Context:\n${context}\n\nQuestion: ${searchQuery}\n\nProvide a direct answer based on the context above.`,
              },
            ],
            temperature: 0.3,
            max_tokens: 200,
          }),
        })

        const data = await response.json()
        const aiAnswer = data.choices?.[0]?.message?.content || ''

        // Add AI summary as first result
        if (aiAnswer) {
          results.unshift({
            documentId: 'ai-summary',
            title: 'AI Answer',
            chunk: aiAnswer,
            relevance: 1.0,
          })
        }
      } catch (error) {
        console.error('AI search error:', error)
      }
    }

    setSearchResults(results.slice(0, 10))
    setIsSearching(false)
  }, [searchQuery, documents, generateEmbedding])

  useEffect(() => {
    const timer = setTimeout(performSearch, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const getRelevanceColor = (relevance: number) => {
    if (relevance > 0.8) return 'text-green-400 bg-green-500/20'
    if (relevance > 0.6) return 'text-blue-400 bg-blue-500/20'
    if (relevance > 0.4) return 'text-amber-400 bg-amber-500/20'
    return 'text-gray-400 bg-gray-500/20'
  }

  if (showApp) {
    return (
      <div className="min-h-screen bg-[#0f0f12] text-white">
        <header className="bg-[#16161d] border-b border-white/5 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">RAG Knowledge Base</h1>
                <p className="text-xs text-gray-400">Powered by MiniMax AI</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                loading={isIndexing}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                accept=".txt,.md,.json,.js,.ts,.py"
                className="hidden"
              />
              <Button variant="ghost" size="sm" onClick={() => setShowApp(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-6">
          {/* Search Bar */}
          <Card className="mb-6 bg-[#16161d] border-white/5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your knowledge base..."
                className="w-full pl-12 pr-12 py-4 text-lg bg-[#1a1a24] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Documents */}
            <Card className="bg-[#16161d] border-white/5">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium">Documents</span>
                </div>
                <span className="text-xs text-gray-500">{documents.length}</span>
              </div>
              <div className="p-4">
                {documents.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No documents yet</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-1" /> Upload
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedDoc?.id === doc.id
                            ? 'bg-amber-500/10 border border-amber-500/30'
                            : 'bg-[#1a1a24] hover:bg-[#252530]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-amber-400" />
                          <span className="text-sm truncate flex-1">{doc.name}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <Database className="h-3 w-3" />
                          <span>{doc.chunks} chunks</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Search Results */}
            <Card className="lg:col-span-2 bg-[#16161d] border-white/5">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium">Search Results</span>
                </div>
                {isSearching && (
                  <div className="flex items-center gap-2 text-xs text-amber-400">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Searching...
                  </div>
                )}
              </div>
              <div className="p-4">
                {searchResults.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Search or upload documents</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchResults.map((result, i) => (
                      <div
                        key={i}
                        className="p-4 bg-[#1a1a24] rounded-xl hover:bg-[#252530] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-amber-400" />
                            <span className="text-sm text-amber-400 font-medium">
                              {result.title}
                            </span>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getRelevanceColor(result.relevance)}`}
                          >
                            {(result.relevance * 100).toFixed(1)}% match
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{result.chunk}</p>
                      </div>
                    ))}
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
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-[#0f0f12] to-orange-900/10"></div>
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 left-1/4 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      <nav className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              RAG Knowledge Base
            </span>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowApp(true)}>
            <Play className="h-4 w-4 mr-2" />
            Try App
          </Button>
        </div>
      </nav>

      <section className="relative z-10 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6">
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
              Build intelligent knowledge bases with RAG. Upload documents, ask questions, get
              instant answers.
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-2xl opacity-50 group-hover:opacity-75 blur transition-all duration-300"></div>
                <div className="relative flex items-center gap-4 bg-[#16161d]/90 backdrop-blur-xl rounded-2xl p-2">
                  <div className="pl-4">
                    <Search className="h-6 w-6 text-amber-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Ask a question about your knowledge base..."
                    className="flex-1 px-4 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
                    onClick={() => setShowApp(true)}
                    readOnly
                  />
                  <Button onClick={() => setShowApp(true)}>
                    <Sparkles className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 max-w-5xl mx-auto">
            <div className="bg-[#16161d]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <span className="text-gray-400 text-sm">Knowledge Base Q&A</span>
                <span className="text-amber-400 text-sm flex items-center gap-2">
                  <Database className="h-4 w-4" />5 Documents Indexed
                </span>
              </div>
              <div className="p-6 grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="text-xs text-orange-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />
                    Search Results
                  </div>
                  {[
                    {
                      title: 'API Documentation.pdf',
                      match: '94.2%',
                      snippet: 'The API endpoint accepts POST requests with JSON payload...',
                    },
                    {
                      title: 'Architecture Guide.md',
                      match: '87.5%',
                      snippet: 'Our microservices architecture consists of multiple services...',
                    },
                    {
                      title: 'Deployment Steps.txt',
                      match: '82.1%',
                      snippet: 'To deploy, run the following commands in order...',
                    },
                  ].map((result, i) => (
                    <div
                      key={i}
                      className="p-4 bg-[#1a1a24] border border-white/10 rounded-xl hover:bg-[#252530] transition-all cursor-pointer"
                      onClick={() => setShowApp(true)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-amber-400" />
                          <span className="text-sm text-amber-400 font-medium">{result.title}</span>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                          {result.match} match
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{result.snippet}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="text-xs text-yellow-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />
                    Index Statistics
                  </div>
                  {[
                    {
                      icon: Database,
                      label: '1,247 Chunks Indexed',
                      sublabel: 'From 5 documents',
                      color: 'amber',
                    },
                    {
                      icon: Brain,
                      label: 'Vector Similarity',
                      sublabel: 'Semantic search enabled',
                      color: 'orange',
                    },
                    {
                      icon: Clock,
                      label: 'Query Time',
                      sublabel: '~45ms average response',
                      color: 'yellow',
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className={`p-4 bg-${stat.color}-500/10 border border-${stat.color}-500/20 rounded-xl`}
                    >
                      <div className="flex items-start gap-3">
                        <stat.icon className={`h-5 w-5 text-${stat.color}-400 mt-0.5`} />
                        <div>
                          <div className={`text-sm text-${stat.color}-400 font-medium`}>
                            {stat.label}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{stat.sublabel}</div>
                        </div>
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
          <div className="relative p-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Unlock Your Knowledge</h2>
            <p className="text-amber-100 mb-8">Transform documents into intelligent answers.</p>
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
