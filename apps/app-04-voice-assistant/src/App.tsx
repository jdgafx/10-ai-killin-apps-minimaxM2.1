import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  ChevronRight, 
  Zap, 
  Clock, 
  Globe, 
  Settings, 
  Play, 
  Pause, 
  Waves, 
  Bot, 
  Send, 
  X,
  Radio,
  Headphones
} from 'lucide-react';
import { Card, Button, Input } from './lib/components';

interface Message { id: string; role: 'user' | 'assistant'; content: string; timestamp: Date; audioUrl?: string; }

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showApp, setShowApp] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isRecording || isProcessing) {
      let interval: NodeJS.Timeout;
      const wave = () => {
        setAudioLevel(Math.random() * 100);
        interval = setTimeout(wave, 100);
      };
      wave();
      return () => clearTimeout(interval);
    }
  }, [isRecording, isProcessing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawWaveform = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() / 1000;
      const bars = 64;
      const barWidth = canvas.width / bars - 2;

      for (let i = 0; i < bars; i++) {
        const height = isRecording || isProcessing 
          ? (Math.sin(time * 3 + i * 0.3) * 0.5 + 0.5) * (audioLevel / 100 * 80 + 20)
          : 20;
        const hue = (i / bars) * 60 + 160;
        const gradient = ctx.createLinearGradient(0, canvas.height - height, 0, canvas.height);
        gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, 1)`);
        gradient.addColorStop(1, `hsla(${hue}, 80%, 40%, 1)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(i * (barWidth + 2), canvas.height - height, barWidth, height);
      }

      if (isRecording || isProcessing) {
        animationRef.current = requestAnimationFrame(drawWaveform);
      }
    };

    drawWaveform();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRecording, isProcessing, audioLevel]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      setIsProcessing(true);
      setTimeout(() => {
        const responses = [
          "I heard you ask about the weather. Currently, it's sunny with a high of 72°F.",
          "Based on your question, here's what I found in your documents...",
          "I've analyzed your request and prepared the following response...",
        ];
        setMessages(prev => [...prev, {
          id: Date.now().toString(), 
          role: 'assistant', 
          content: responses[Math.floor(Math.random() * responses.length)], 
          timestamp: new Date()
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
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: "That's a great question! Let me analyze that for you...", 
        timestamp: new Date()
      }]);
      setIsProcessing(false);
    }, 1500);
  }, [input]);

  if (showApp) {
    return (
      <div className="min-h-screen bg-[#0d0d12] text-white flex flex-col">
        {/* Header */}
        <header className="bg-[#16161d] border-b border-white/5 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">Voice Assistant</h1>
                <p className="text-xs text-gray-400">Powered by MiniMax AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm"><Headphones className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm"><Settings className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" onClick={() => setShowApp(false)}><X className="h-4 w-4" /></Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6">
          {/* Voice Visualizer */}
          <Card className="mb-6 bg-[#16161d] border-white/5">
            <div className="text-center p-8">
              <canvas ref={canvasRef} width={600} height={120} className="w-full h-24 mb-4" />
              
              {(isRecording || isProcessing) && (
                <div className="flex items-center justify-center gap-2 text-emerald-400 mb-4">
                  <Radio className="h-4 w-4 animate-pulse" />
                  <span className="text-sm">{isRecording ? 'Listening...' : 'Processing...'}</span>
                </div>
              )}
              
              <Button 
                size="lg" 
                onClick={toggleRecording} 
                disabled={isProcessing}
                className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'}`}
              >
                {isRecording ? <><MicOff className="h-5 w-5 mr-2" />Stop</> : <><Mic className="h-5 w-5 mr-2" />Start Speaking</>}
              </Button>
              
              <p className="text-xs text-gray-500 mt-3">Tap to speak or type below</p>
            </div>
          </Card>

          {/* Messages */}
          <div className="flex-1 space-y-4 mb-6 overflow-auto">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-violet-500 to-indigo-500' 
                    : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                }`}>
                  {msg.role === 'user' ? <span className="text-sm">U</span> : <Bot className="h-5 w-5" />}
                </div>
                <div className={`max-w-xl ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 rounded-tr-none' 
                      : 'bg-[#1e1e27] rounded-tl-none'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{msg.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {isProcessing && messages.length === 0 && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="bg-[#1e1e27] p-4 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            {messages.length === 0 && !isProcessing && (
              <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                <Waves className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm">Start a conversation</p>
                <p className="text-xs">Tap the microphone or type a message</p>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Or type a message..."
              className="flex-1 px-4 py-3 bg-[#1e1e27] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <Button onClick={handleSend} disabled={!input.trim() || isProcessing}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-[#0d0d12] to-cyan-900/10"></div>
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <nav className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl">
              <Mic className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Voice Assistant</span>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowApp(true)}>
            <Play className="h-4 w-4 mr-2" />
            Try App
          </Button>
        </div>
      </nav>

      <section className="relative z-10 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-8">
            <Sparkles className="h-4 w-4" />
            <span>Powered by MiniMax Voice AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">Your AI Voice Assistant</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Speaks Your Language</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Experience natural voice conversations with AI. Powered by advanced speech recognition and synthesis.</p>
          
          <Button size="lg" onClick={() => setShowApp(true)} className="group">
            Start Speaking
            <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="mt-20 max-w-3xl mx-auto">
          <div className="bg-[#16161d]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 text-center">
              <canvas ref={canvasRef} width={600} height={80} className="w-full h-16 mb-6" />
              <p className="text-gray-500 mb-4">Tap the microphone and start speaking</p>
              <Button size="lg" onClick={() => setShowApp(true)} className="bg-gradient-to-r from-emerald-500 to-cyan-500">
                Launch App →
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative p-12 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-3xl overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Talk to AI?</h2>
            <p className="text-emerald-100 mb-8">Start your voice conversation today.</p>
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
