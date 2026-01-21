import React, { useState, useCallback } from 'react';
import { 
  MessageSquare, 
  FileText, 
  Search, 
  Sparkles,
  ArrowRight,
  Upload,
  Zap,
  Shield,
  Clock,
  Bot,
  Send,
  CheckCircle2,
  Brain,
  Play,
  X
} from 'lucide-react';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from './lib/components';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<{id: string; name: string; content: string}[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [showApp, setShowApp] = useState(false);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response
    await new Promise(r => setTimeout(r, 1500));
    
    const responses = [
      "Based on your documents, I found that the key findings include a 47% revenue increase in Q4 and improved customer retention at 94%.",
      "Looking at the data, the report mentions successful market expansion and operational efficiency improvements across all departments.",
      "The document analysis shows three main action items: optimize workflow, reduce costs, and enhance customer experience.",
      "From the uploaded files, I can see the Q4 metrics are positive with strong growth in all key performance indicators."
    ];
    
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  }, [input]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setDocuments(prev => [...prev, {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          content: content.substring(0, 500)
        }]);
      };
      reader.readAsText(file);
    }
    setShowUpload(false);
  }, []);

  if (showApp) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">Document Chat</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setShowUpload(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowApp(false)}>
                Back to Home
              </Button>
            </div>
          </div>
        </header>
        
        {showUpload && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Upload Documents</h3>
                <button onClick={() => setShowUpload(false)}><X className="h-5 w-5" /></button>
              </div>
              <input
                type="file"
                multiple
                accept=".txt,.md,.json,.js,.ts,.py"
                onChange={handleFileUpload}
                className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg"
              />
              <p className="text-sm text-gray-400 mt-2">Supports text files, Markdown, and code</p>
            </Card>
          </div>
        )}
        
        <main className="max-w-4xl mx-auto p-6">
          {documents.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {documents.map(doc => (
                <span key={doc.id} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  {doc.name}
                </span>
              ))}
            </div>
          )}
          
          <div className="space-y-4 mb-6">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Upload documents and ask questions</p>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-gradient-to-r from-violet-500 to-indigo-500' : 'bg-gradient-to-r from-cyan-500 to-teal-500'
                  }`}>
                    {msg.role === 'user' ? 'You' : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`max-w-md p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 rounded-tr-none' 
                      : 'bg-white/10 rounded-tl-none'
                  }`}>
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none">
                  <LoadingSpinner />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question about your documents..."
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
            />
            <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-cyan-900/20 to-teal-900/20"></div>
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <nav className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
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
              Try App
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative z-10 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Upload any document and ask questions in natural language. Our AI understands context and provides accurate answers.
            </p>
            
            <Button size="lg" onClick={() => setShowApp(true)} className="group">
              Start Chatting
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Chat Demo */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Document Chat</span>
                </div>
                <Button size="sm" onClick={() => setShowApp(true)}>Open App →</Button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-none p-4">
                    <p className="text-sm">Hi! I've analyzed your documents. What would you like to know?</p>
                  </div>
                </div>
                <div className="flex gap-4 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">You</span>
                  </div>
                  <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl rounded-tr-none p-4">
                    <p className="text-sm">What are the key findings in this report?</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-none p-4">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-300">
                          Based on my analysis, key findings include:
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-gray-400">
                          <li className="flex items-start gap-2"><span className="text-cyan-400">•</span>Revenue increased by 47% in Q4</li>
                          <li className="flex items-start gap-2"><span className="text-cyan-400">•</span>Customer retention improved to 94%</li>
                          <li className="flex items-start gap-2"><span className="text-cyan-400">•</span>New market expansion successful</li>
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

      {/* CTA */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative p-12 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-3xl overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Unlock Your Documents?</h2>
            <Button size="lg" variant="secondary" onClick={() => setShowApp(true)} className="group">
              Launch App
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
