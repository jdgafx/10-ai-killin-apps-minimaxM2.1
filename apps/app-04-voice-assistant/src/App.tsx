import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles,
  ArrowRight,
  Zap,
  Clock,
  Globe,
  Settings,
  Play,
  Pause,
  Waves
} from 'lucide-react';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from './lib/components';

function LandingPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-cyan-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Voice Assistant
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a>
              <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm">How it Works</a>
              <Button variant="primary" size="sm">
                Try for Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-8">
              <Sparkles className="h-4 w-4" />
              <span>Powered by MiniMax Voice AI</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                Your AI Voice Assistant
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Speaks Your Language
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience natural voice conversations with AI. Powered by advanced speech recognition 
              and synthesis for seamless, human-like interactions.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="group" onClick={() => setIsRecording(!isRecording)}>
                {isRecording ? (
                  <>
                    <MicOff className="h-5 w-5 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 mr-2" />
                    Start Speaking
                  </>
                )}
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                Listen to Demo
              </Button>
            </div>
          </div>

          {/* Voice Interface Demo */}
          <div className="mt-20 max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-8 text-center">
                {/* Audio Visualizer */}
                <div className="mb-8">
                  <div className="flex items-center justify-center gap-1 h-24 mb-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2 bg-gradient-to-t from-emerald-500 to-cyan-500 rounded-full transition-all duration-150"
                        style={{
                          height: `${isRecording ? Math.max(20, audioLevel + Math.random() * 60) : 20}px`,
                          opacity: isRecording ? 1 : 0.3,
                        }}
                      ></div>
                    ))}
                  </div>
                  
                  {isRecording && (
                    <div className="flex items-center justify-center gap-2 text-red-400">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm">Listening...</span>
                    </div>
                  )}
                </div>

                {/* Transcript */}
                <div className="bg-white/5 rounded-2xl p-6 mb-6">
                  {isRecording ? (
                    <p className="text-gray-300 animate-pulse">I'm listening...</p>
                  ) : transcript ? (
                    <div>
                      <p className="text-white mb-2">"What's the weather like today?"</p>
                      <p className="text-emerald-400 text-sm">Transcribed in 0.3s</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">Tap the microphone and start speaking</p>
                  )}
                </div>

                {/* Response */}
                {isProcessing && (
                  <div className="flex items-center justify-center gap-2 text-cyan-400">
                    <LoadingSpinner className="h-5 w-5" />
                    <span>Generating response...</span>
                  </div>
                )}

                {!isRecording && !transcript && (
                  <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Play Demo
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10M+', label: 'Voice Interactions' },
              { value: '99.5%', label: 'Accuracy Rate' },
              { value: '0.2s', label: 'Response Time' },
              { value: '50+', label: 'Languages' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The most advanced AI voice assistant technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Mic className="h-6 w-6" />,
                title: 'Natural Speech',
                description: 'Advanced ASR technology understands your natural speaking patterns and accents.',
                gradient: 'from-emerald-500 to-teal-500'
              },
              {
                icon: <Volume2 className="h-6 w-6" />,
                title: 'Lifelike Voices',
                description: 'High-quality TTS synthesis with natural intonation and emotion.',
                gradient: 'from-teal-500 to-cyan-500'
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: 'Real-Time',
                description: 'Lightning-fast processing for seamless, natural conversations.',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: <Globe className="h-6 w-6" />,
                title: 'Multilingual',
                description: 'Supports over 50 languages with native-level understanding.',
                gradient: 'from-blue-500 to-indigo-500'
              },
              {
                icon: <Waves className="h-6 w-6" />,
                title: 'Noise Resistant',
                description: 'Crystal-clear recognition even in noisy environments.',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: <Clock className="h-6 w-6" />,
                title: '24/7 Available',
                description: 'Your AI assistant is always ready to help, anytime.',
                gradient: 'from-rose-500 to-red-500'
              },
            ].map((feature, i) => (
              <div key={i} className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative z-10 py-24 bg-gradient-to-b from-transparent via-emerald-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Start chatting with voice in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Speak Your Request',
                description: 'Tap the microphone and speak naturally to your assistant',
                icon: <Mic className="h-8 w-8" />
              },
              {
                step: '02',
                title: 'AI Processing',
                description: 'Our advanced AI understands and processes your request',
                icon: <Sparkles className="h-8 w-8" />
              },
              {
                step: '03',
                title: 'Get Answers',
                description: 'Receive instant, accurate responses in natural voice',
                icon: <Volume2 className="h-8 w-8" />
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-xl opacity-30 rounded-full"></div>
                  <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white/10 border border-white/20 rounded-2xl">
                    {item.icon}
                  </div>
                </div>
                <div className="text-emerald-400 text-sm font-mono mb-2">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative p-12 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Talk to AI?</h2>
              <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
                Experience the future of voice interaction. 
                Start talking to your AI assistant today.
              </p>
              <Button size="lg" variant="secondary" className="group">
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">Voice Assistant</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="text-gray-500 text-sm">
              © 2025 All rights reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
