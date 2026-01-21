import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  MessageSquare,
  FileText,
  Sparkles,
  ChevronRight,
  Upload,
  Zap,
  Shield,
  Clock,
  Bot,
  Send,
  CheckCircle,
  Brain,
  Play,
  X,
  Search,
  Plus,
} from 'lucide-react'
import { Card, Button, Input } from './lib/components'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Document {
  id: string
  name: string
  content: string
  chunks: number
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [showApp, setShowApp] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = useCallback(async () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      // Get document context
      const docContext = documents.map((d) => d.content).join('\n\n---DOC---\n\n')

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
              content: `You are a document Q&A assistant. Answer questions based on the provided documents. If the answer isn't in the documents, say so clearly.\n\nDocuments:\n${docContext || 'No documents uploaded yet.'}`,
            },
            { role: 'user', content: input },
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      })

      const data = await response.json()
      const aiResponse =
        data.choices?.[0]?.message?.content ||
        "I couldn't find a specific answer in your documents."

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMsg])
    } catch (error) {
      console.error('Chat error:', error)
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMsg])
    }

    setIsLoading(false)
    setIsTyping(false)
  }, [input, documents])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    for (const file of Array.from(files)) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        const chunks = content.split(/\n\n+/).filter((c) => c.length > 50).length
        setDocuments((prev) => [
          ...prev,
          {
            id: Date.now().toString() + Math.random(),
            name: file.name,
            content: content.substring(0, 500),
            chunks,
          },
        ])
      }
      reader.readAsText(file)
    }
    setShowUpload(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  if (showApp) {
    return (
      <div className="min-h-screen bg-[#0f0f12] text-white flex">
        {/* Sidebar */}
        <aside className="w-72 bg-[#16161d] border-r border-white/5 flex flex-col">
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold">Document Chat</span>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept=".txt,.md,.json,.js,.ts,.py"
              className="hidden"
            />
          </div>

          {/* Documents */}
          <div className="flex-1 overflow-auto p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Documents</div>
            {documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
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
                    className="p-3 bg-[#1e1e27] rounded-lg hover:bg-[#252530] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm truncate flex-1">{doc.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{doc.chunks} chunks</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">U</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">User</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-[#0f0f12]/80 backdrop-blur border-b border-white/5 flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-cyan-400" />
              <span className="font-medium">RAG-Powered Chat</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Encrypted
              </span>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-2xl mb-4">
                  <Bot className="h-12 w-12 text-cyan-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Start a Conversation</h2>
                <p className="text-gray-400 max-w-md">
                  Upload documents and ask questions about their content. I'll provide accurate,
                  context-aware answers.
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-violet-500 to-indigo-500'
                          : 'bg-gradient-to-r from-cyan-500 to-teal-500'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <span className="text-sm font-medium">U</span>
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                    </div>
                    <div className={`max-w-2xl ${msg.role === 'user' ? 'text-right' : ''}`}>
                      <div
                        className={`inline-block p-4 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-cyan-500 to-teal-500 rounded-tr-none'
                            : 'bg-[#1e1e27] rounded-tl-none'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div className="bg-[#1e1e27] p-4 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1">
                        <span
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        ></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5">
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUpload(true)}
                className="shrink-0"
              >
                <Upload className="h-5 w-5" />
              </Button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your documents..."
                className="flex-1 px-4 py-3 bg-[#1e1e27] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="shrink-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </main>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#1e1e27] border border-white/10 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Upload Documents</h3>
                <button onClick={() => setShowUpload(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-cyan-500/50 transition-colors"
              >
                <Upload className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">TXT, MD, JSON, JS, TS, PY</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                accept=".txt,.md,.json,.js,.ts,.py"
                className="hidden"
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-[#0f0f12] to-teal-900/10"></div>
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      <nav className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Document Chat
            </span>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowApp(true)}>
            <Play className="h-4 w-4 mr-2" />
            Launch App
          </Button>
        </div>
      </nav>

      <section className="relative z-10 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-8">
              <Brain className="h-4 w-4" />
              <span>Powered by RAG Technology</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-teal-200 bg-clip-text text-transparent">
                Chat with Your Documents
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Upload any document and ask questions in natural language. Our AI understands context
              and provides accurate answers.
            </p>

            <Button size="lg" onClick={() => setShowApp(true)} className="group">
              Start Chatting
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Chat Demo */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-[#16161d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Document Chat</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">2 documents</span>
                  <Button size="sm" onClick={() => setShowApp(true)}>
                    Open App →
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="bg-[#1e1e27] rounded-2xl rounded-tl-none p-4">
                    <p className="text-sm">
                      Hi! I've analyzed your documents. What would you like to know?
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 flex-row-reverse">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">U</span>
                  </div>
                  <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl rounded-tr-none p-4">
                    <p className="text-sm">What are the key findings in this report?</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="bg-[#1e1e27] rounded-2xl rounded-tl-none p-4">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-300">
                          Based on my analysis, key findings include:
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-gray-400">
                          <li className="flex items-start gap-2">
                            <span className="text-cyan-400">•</span>Revenue increased by 47% in Q4
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-cyan-400">•</span>Customer retention improved to
                            94%
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-cyan-400">•</span>New market expansion successful
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative p-12 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-3xl overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Unlock Your Documents?</h2>
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
