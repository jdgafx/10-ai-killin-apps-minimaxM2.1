import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useAIProvider } from '@packages/ai-providers';
import { Card, Button, LoadingSpinner, ErrorAlert, MessageBubble } from '@packages/shared-ui';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  Bot, 
  User, 
  Clock,
  Play,
  Pause
} from 'lucide-react';

interface VoiceSettings {
  rate: number;
  pitch: number;
  volume: number;
  voice: SpeechSynthesisVoice | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  audioUrl?: string;
}

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [provider, setProvider] = useState('minimax');
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    rate: 1,
    pitch: 1,
    volume: 1,
    voice: null,
  });

  const { chat, streamChat, isLoading } = useAIProvider();

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setInput(transcript);
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
      const loadVoices = () => {
        voicesRef.current = synthesisRef.current?.getVoices() || [];
        if (voicesRef.current.length > 0 && !voiceSettings.voice) {
          // Prefer a female voice for the assistant
          const preferred = voicesRef.current.find(v => 
            v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria')
          );
          setVoiceSettings(prev => ({ ...prev, voice: preferred || voicesRef.current[0] }));
        }
      };
      loadVoices();
      synthesisRef.current.onvoiceschanged = loadVoices;
    }

    return () => {
      recognitionRef.current?.abort();
      synthesisRef.current?.cancel();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startRecording = useCallback(() => {
    if (recognitionRef.current && !isRecording) {
      setError(null);
      recognitionRef.current.start();
      setIsRecording(true);
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const speak = useCallback((text: string) => {
    if (!synthesisRef.current || isMuted) return;

    synthesisRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceSettings.rate;
    utterance.pitch = voiceSettings.pitch;
    utterance.volume = voiceSettings.volume;
    utterance.voice = voiceSettings.voice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  }, [voiceSettings, isMuted]);

  const stopSpeaking = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const handleSend = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const userMsg: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      let response = '';
      await streamChat(
        [
          { role: 'system', content: 'You are a helpful voice assistant. Keep your responses concise and conversational for voice output.' },
          { role: 'user', content: message },
        ],
        (token) => {
          response += token;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last.role === 'user') {
              return [...prev, { role: 'assistant', content: response, timestamp: new Date().toLocaleTimeString() }];
            }
            return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: response } : m);
          });
        }
      );

      // Speak the response
      setTimeout(() => speak(response), 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response');
    }
  }, [streamChat, speak]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Voice Assistant</h1>
              <p className="text-sm text-gray-300">Powered by MiniMax AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="minimax">MiniMax</option>
              <option value="deepseek">DeepSeek</option>
            </select>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-white/70 hover:text-white transition-colors"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {showSettings && (
        <div className="bg-white/5 border-b border-white/10 p-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-white font-medium mb-4">Voice Settings</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Rate</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceSettings.rate}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{voiceSettings.rate.toFixed(1)}x</span>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Pitch</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceSettings.pitch}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{voiceSettings.pitch.toFixed(1)}</span>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Volume</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={voiceSettings.volume}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{Math.round(voiceSettings.volume * 100)}%</span>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Voice</label>
                <select
                  value={voiceSettings.voice?.name || ''}
                  onChange={(e) => {
                    const voice = voicesRef.current.find(v => v.name === e.target.value);
                    setVoiceSettings(prev => ({ ...prev, voice: voice || null }));
                  }}
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                >
                  {voicesRef.current.map((v) => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-4xl mx-auto px-4 mt-4">
          <ErrorAlert message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Messages */}
        <div className="space-y-4 mb-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-12 w-12 text-white/50" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Voice Assistant Ready</h2>
              <p className="text-gray-400">Click the microphone to start talking</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <MessageBubble
                key={i}
                role={msg.role}
                content={msg.content}
                provider={provider}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/10 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-4 rounded-full transition-all ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full transition-colors ${
                  isMuted ? 'bg-gray-600 text-gray-300' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>

              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="p-3 rounded-full bg-yellow-600 text-white hover:bg-yellow-700 transition-colors animate-pulse"
                >
                  <Pause className="h-5 w-5" />
                </button>
              )}

              <Button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isLoading}
                loading={isLoading}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
