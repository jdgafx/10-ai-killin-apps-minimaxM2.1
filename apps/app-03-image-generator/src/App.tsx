import React, { useState, useCallback } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Palette,
  Zap,
  Download,
  Wand2,
  Layers,
  Clock,
  CheckCircle2,
  Play,
  X,
  ArrowRight
} from 'lucide-react';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from './lib/components';

interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  style: string;
  timestamp: Date;
}

const sampleImages = [
  { id: '1', prompt: 'Cyberpunk city at night', style: 'Cinematic', gradient: 'from-purple-500 to-pink-500' },
  { id: '2', prompt: 'Peaceful mountain landscape', style: 'Oil Painting', gradient: 'from-green-500 to-teal-500' },
  { id: '3', prompt: 'Abstract geometric patterns', style: 'Minimalist', gradient: 'from-orange-500 to-red-500' },
  { id: '4', prompt: 'Portrait of a warrior', style: 'Digital Art', gradient: 'from-blue-500 to-indigo-500' },
];

function App() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [showApp, setShowApp] = useState(false);

  const generateImage = useCallback(async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate image generation
    await new Promise(r => setTimeout(r, 3000));
    
    const gradients = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-violet-500 to-indigo-500',
      'from-pink-500 to-rose-500',
    ];
    
    const newImage: GeneratedImage = {
      id: Date.now().toString(),
      prompt,
      url: gradients[Math.floor(Math.random() * gradients.length)],
      style: ['Cinematic', 'Oil Painting', 'Digital Art', 'Minimalist', '3D Render'][Math.floor(Math.random() * 5)],
      timestamp: new Date()
    };
    
    setGeneratedImages(prev => [newImage, ...prev]);
    setCurrentImage(newImage.url);
    setIsGenerating(false);
    setPrompt('');
  }, [prompt]);

  const downloadImage = useCallback((gradient: string) => {
    // Create a canvas and download
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
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
  }, []);

  if (showApp) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg">
                <ImageIcon className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">AI Image Generator</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowApp(false)}>
              Back to Home
            </Button>
          </div>
        </header>
        
        <main className="max-w-6xl mx-auto p-6">
          {/* Generator */}
          <Card className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && generateImage()}
                placeholder="Describe your image..."
                className="flex-1 px-4 py-3 bg-gray-950 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
              />
              <Button onClick={() => generateImage()} disabled={!prompt.trim() || isGenerating}>
                {isGenerating ? (
                  <>
                    <LoadingSpinner className="h-5 w-5 mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </Card>
          
          {/* Current Image */}
          {currentImage && (
            <Card className="mb-8">
              <h3 className="font-semibold mb-4">Latest Generation</h3>
              <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                <div className={`absolute inset-0 bg-gradient-to-br ${currentImage}`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white/80 text-lg font-medium text-center px-4">
                    {generatedImages[0]?.prompt || 'Your generated image'}
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => downloadImage(currentImage)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </Card>
          )}
          
          {/* Gallery */}
          <div>
            <h3 className="font-semibold mb-4">Your Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {generatedImages.map((img) => (
                <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer" onClick={() => setCurrentImage(img.url)}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${img.url}`}></div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" variant="secondary" onClick={() => { downloadImage(img.url); }}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-xs text-white bg-black/50 px-2 py-1 rounded truncate">{img.prompt}</p>
                  </div>
                </div>
              ))}
              {generatedImages.length === 0 && sampleImages.map((img) => (
                <div key={img.id} className="aspect-square rounded-xl overflow-hidden cursor-pointer" onClick={() => setCurrentImage(img.gradient)}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${img.gradient}`}></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-violet-900/20"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <nav className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
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
              Try App
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative z-10 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Gallery Preview */}
          <div className="mt-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Recent Creations</h2>
              <Button size="sm" onClick={() => setShowApp(true)}>View All →</Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {sampleImages.map((img) => (
                <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer" onClick={() => setShowApp(true)}>
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

      {/* CTA */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative p-12 bg-gradient-to-r from-pink-600 to-violet-600 rounded-3xl overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create Magic?</h2>
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
