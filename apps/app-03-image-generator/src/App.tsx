import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Palette,
  Download,
  Wand2,
  Layers,
  Clock,
  CheckCircle,
  Play,
  X,
  ChevronRight,
  Heart,
  RefreshCw,
  ZoomIn
} from 'lucide-react';
import { Card, Button, Input } from './lib/components';

interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  style: string;
  timestamp: Date;
}

const styles = [
  { id: 'photorealistic', name: 'Photorealistic', icon: '📸' },
  { id: 'oil-painting', name: 'Oil Painting', icon: '🎨' },
  { id: 'digital-art', name: 'Digital Art', icon: '✨' },
  { id: 'anime', name: 'Anime', icon: '🎌' },
  { id: '3d-render', name: '3D Render', icon: '🎲' },
  { id: 'minimalist', name: 'Minimalist', icon: '◻️' },
];

function App() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('photorealistic');
  const [showApp, setShowApp] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const gradients = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-violet-500 to-indigo-500',
    'from-pink-500 to-rose-500',
    'from-amber-500 to-yellow-500',
    'from-teal-500 to-cyan-500',
  ];

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 300);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isGenerating]);

  const generateImage = useCallback(async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setProgress(0);
    
    await new Promise(r => setTimeout(r, 3000));
    
    const newImage: GeneratedImage = {
      id: Date.now().toString(),
      prompt,
      url: gradients[Math.floor(Math.random() * gradients.length)],
      style: styles.find(s => s.id === selectedStyle)?.name || 'Custom',
      timestamp: new Date()
    };
    
    setGeneratedImages(prev => [newImage, ...prev]);
    setCurrentImage(newImage.url);
    setIsGenerating(false);
    setPrompt('');
  }, [prompt, selectedStyle]);

  const downloadImage = useCallback((gradient: string) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const colors = gradient.replace('from-', '').replace('to-', '').split(' ');
        const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient1.addColorStop(0, colors[0].replace('-500', '-400'));
        gradient1.addColorStop(1, colors[1].replace('-500', '-400'));
        ctx.fillStyle = gradient1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const link = document.createElement('a');
        link.download = `ai-image-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    }
  }, []);

  if (showApp) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <canvas ref={canvasRef} width={1024} height={1024} className="hidden" />
        
        {/* Header */}
        <header className="bg-[#12121a] border-b border-white/5 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg">
                <ImageIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">AI Image Generator</h1>
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
          {/* Generator */}
          <Card className="mb-8 bg-[#12121a] border-white/5">
            <div className="p-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && e.shiftKey && generateImage()}
                placeholder="Describe the image you want to generate..."
                className="w-full h-24 px-4 py-3 bg-[#1a1a24] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 resize-none mb-4"
              />
              
              {/* Style Selection */}
              <div className="mb-4">
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Style</label>
                <div className="flex flex-wrap gap-2">
                  {styles.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedStyle === style.id
                          ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white'
                          : 'bg-[#1a1a24] text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="mr-1">{style.icon}</span>
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={generateImage} 
                disabled={!prompt.trim() || isGenerating} 
                className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating... {Math.min(Math.round(progress), 100)}%
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Current Image */}
            {currentImage && (
              <Card className="lg:col-span-2 bg-[#12121a] border-white/5">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <h2 className="font-semibold">Latest Generation</h2>
                  <Button variant="outline" size="sm" onClick={() => downloadImage(currentImage)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="p-4">
                  <div className="relative aspect-square rounded-xl overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${currentImage}`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-white/80 text-lg font-medium text-center px-4 bg-black/30 backdrop-blur rounded-lg">
                        {generatedImages[0]?.prompt || 'Your generated image'}
                      </p>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 bg-black/50 backdrop-blur rounded-lg px-3 py-2">
                        <span className="text-xs text-gray-300">{generatedImages[0]?.style}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-400">{generatedImages[0]?.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Gallery */}
            <Card className="bg-[#12121a] border-white/5">
              <div className="p-4 border-b border-white/5">
                <h2 className="font-semibold">Your Gallery</h2>
                <p className="text-xs text-gray-500">{generatedImages.length} images</p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-auto">
                  {generatedImages.map((img) => (
                    <div 
                      key={img.id} 
                      className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => setCurrentImage(img.url)}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${img.url}`}></div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ZoomIn className="h-6 w-6" />
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
                        <p className="text-xs text-white bg-black/70 px-2 py-1 rounded truncate">{img.prompt}</p>
                      </div>
                    </div>
                  ))}
                  {generatedImages.length === 0 && (
                    <div className="col-span-2 text-center py-12 text-gray-500">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No images yet</p>
                      <p className="text-xs">Start generating!</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/10 via-[#0a0a0f] to-violet-900/10"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <nav className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl">
              <ImageIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
              AI Image Generator
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400 text-sm mb-8">
              <Sparkles className="h-4 w-4" />
              <span>Powered by MiniMax AI</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-pink-200 to-violet-200 bg-clip-text text-transparent">
                Transform Your Imagination
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                Into Stunning Artwork
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Create breathtaking images with simple text prompts. From photorealistic landscapes to abstract art.
            </p>
            
            <Button size="lg" onClick={() => setShowApp(true)} className="group">
              Start Creating
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Gallery Preview */}
          <div className="mt-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Recent Creations</h2>
              <Button size="sm" onClick={() => setShowApp(true)}>View All →</Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { prompt: 'Cyberpunk city at night', style: 'Cinematic', gradient: 'from-purple-500 to-pink-500' },
                { prompt: 'Peaceful mountain landscape', style: 'Oil Painting', gradient: 'from-green-500 to-teal-500' },
                { prompt: 'Abstract geometric patterns', style: 'Minimalist', gradient: 'from-orange-500 to-red-500' },
                { prompt: 'Portrait of a warrior', style: 'Digital Art', gradient: 'from-blue-500 to-indigo-500' },
              ].map((img, i) => (
                <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer" onClick={() => setShowApp(true)}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${img.gradient} opacity-80`}></div>
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm font-medium text-white">{img.prompt}</p>
                    <span className="text-xs text-gray-300">{img.style}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative p-12 bg-gradient-to-r from-pink-600 to-violet-600 rounded-3xl overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create Magic?</h2>
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
