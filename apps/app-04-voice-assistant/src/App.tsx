import React, { useState, useEffect, useCallback } from 'react';
import { 
  Mic, MicOff, Volume2, Sparkles, ArrowRight, Zap, Clock, Globe, Settings, Play, Pause, Waves, Bot, Send, X
} from 'lucide-react';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from './lib/components';

interface Message { id: string; role: 'user' | 'assistant'; content: string; timestamp: Date; }

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => { setAudioLevel(Math.random() * 100); }, 100);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      setIsProcessing(true);
      setTimeout(() => {
        const responses = [
          "I heard you ask about the weather. Currently, it's sunny with a high of 72°F.",
          "Based on your question, here's what I found in your documents...",
          "I've analyzed your request and prepared the following response..."
        ];
        setMessages(prev => [...prev, {
          id: Date.now().toString(), role: 'assistant', content: responses[Math.floor(Math.random() * responses.length)], timestamp: new Date()
        }]);
        setIsProcessing(false);
      }, 2000);
    }
    setIsRecording(!isRecording);
  }, [isRecording]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() }]);
    setInput('');
    setIsProcessing(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), role: 'assistant', content: "That's a great question! Let me analyze that for you...", timestamp: new Date()
      }]);
      setIsProcessing(false);
    }, 1500);
  }, [input]);

  if (showApp) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg"><Mic className="h-5 w-5 text-white" /></div>
              <span className="font-bold">Voice Assistant</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowApp(false)}>Back to Home</Button>
          </div>
        </header>
        <main className="max-w-4xl mx-auto p-6">
          <Card className="mb-6">
            <div className="text-center p-8">
              <div className="flex items-center justify-center gap-1 h-24 mb-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="w-2 bg-gradient-to-t from-emerald-500 to-cyan-500 rounded-full transition-all duration-150"
                    style={{ height: `${isRecording || isProcessing ? Math.max(20, audioLevel + Math.random() * 60) : 20}px`, opacity: (isRecording || isProcessing) ? 1 : 0.3 }}></div>
                ))}
              </div>
              {(isRecording || isProcessing) && (
                <div className="flex items-center justify-center gap-2 text-red-400 mb-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">{isRecording ? 'Listening...' : 'Processing...'}</span>
                </div>
              )}
              <Button size="lg" onClick={toggleRecording} disabled={isProcessing}>
                {isRecording ? <><MicOff className="h-5 w-5 mr-2" />Stop</> : <><Mic className="h-5 w-5 mr-2" />Start Speaking</>}
              </Button>
            </div>
          </Card>
          <div className="space-y-4 mb-6">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-gradient-to-r from-violet-500 to-indigo-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'}`}>
                  {msg.role === 'user' ? 'You' : <Bot className="h-4 w-4" />}
                </div>
                <div className={`max-w-md p-4 rounded-2xl ${msg.role === 'user' ? 'bg-gradient-to-r from-cyan-500 to-teal-500 rounded-tr-none' : 'bg-white/10 rounded-tl-none'}`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {isProcessing && messages.length === 0 && (
              <div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center"><Bot className="h-4 w-4" /></div>
              <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none"><LoadingSpinner /></div></div>
            )}
          </div>
          <div className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Or type a message..." className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500" />
            <Button onClick={handleSend} disabled={!input.trim() || isProcessing}><Send className="h-5 w-5" /></Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-cyan-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      <nav className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl"><Mic className="h-6 w-6 text-white" /></div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Voice Assistant</span>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowApp(true)}><Play className="h-4 w-4 mr-2" />Try App</Button>
        </div>
      </nav>
      <section className="relative z-10 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-8">
            <Sparkles className="h-4 w-4" /><span>Powered by MiniMax Voice AI</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">Your AI Voice Assistant</span>
            <br /><span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Speaks Your Language</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Experience natural voice conversations with AI. Powered by advanced speech recognition and synthesis.</p>
          <Button size="lg" onClick={() => setShowApp(true)} className="group">
            Start Speaking<ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 text-center">
              <div className="flex items-center justify-center gap-1 h-24 mb-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="w-2 bg-gradient-to-t from-emerald-500 to-cyan-500 rounded-full" style={{ height: `${Math.max(20, audioLevel || 20)}px`, opacity: audioLevel ? 1 : 0.3 }}></div>
                ))}
              </div>
              <p className="text-gray-500 mb-4">Tap the microphone and start speaking</p>
              <Button size="lg" onClick={() => setShowApp(true)}>Launch App →</Button>
            </div>
          </div>
        </div>
      </section>
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative p-12 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-3xl overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Talk to AI?</h2>
            <p className="text-emerald-100 mb-8">Start your voice conversation today.</p>
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
