import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Palette, 
  Zap,
  Download,
  Share2,
  Wand2,
  Layers,
  ArrowRight,
  DownloadCloud,
  RefreshCw,
  Brush
} from 'lucide-react';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from './lib/components';

function LandingPage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generatedImages = [
    { id: 1, prompt: 'Cyberpunk city at night', style: 'Cinematic', gradient: 'from-purple-500 to-pink-500' },
    { id: 2, prompt: 'Peaceful mountain landscape', style: 'Oil Painting', gradient: 'from-green-500 to-teal-500' },
    { id: 3, prompt: 'Abstract geometric patterns', style: 'Minimalist', gradient: 'from-orange-500 to-red-500' },
    { id: 4, prompt: 'Portrait of a warrior', style: 'Digital Art', gradient: 'from-blue-500 to-indigo-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-violet-900/20"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pink-500/5 to-violet-500/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '30s' }}></div>
      </div>

      {/* Navigation */}
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
            <div className="flex items-center gap-4">
              <a href="#gallery" className="text-gray-400 hover:text-white transition-colors text-sm">Gallery</a>
              <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a>
              <Button variant="primary" size="sm">
                Create Art
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
              Create breathtaking images with simple text prompts. From photorealistic landscapes 
              to abstract art — your creativity has no limits.
            </p>
            
            {/* Generator Input */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500 rounded-2xl opacity-50 group-hover:opacity-75 blur transition-all duration-300"></div>
                <div className="relative flex items-center gap-4 bg-gray-900/90 backdrop-blur-xl rounded-2xl p-2">
                  <input
                    type="text"
                    placeholder="Describe your image... (e.g., 'A sunset over mountains with vibrant colors')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-1 px-6 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
                  />
                  <Button size="lg" disabled={!prompt || isGenerating}>
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
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <span className="text-gray-500 text-sm">Popular prompts:</span>
                {['Cyberpunk city', 'Oil painting portrait', 'Fantasy landscape', 'Minimalist abstract'].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    onClick={() => setPrompt(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gallery Preview */}
          <div id="gallery" className="mt-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Recent Creations</h2>
              <a href="#" className="text-pink-400 hover:text-pink-300 text-sm flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {generatedImages.map((img) => (
                <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer">
                  <div className={`absolute inset-0 bg-gradient-to-br ${img.gradient} opacity-80`}></div>
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-sm font-medium text-white mb-1">{img.prompt}</p>
                    <span className="text-xs text-gray-300 bg-white/20 px-2 py-0.5 rounded-full">{img.style}</span>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
                      <DownloadCloud className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50M+', label: 'Images Created' },
              { value: '500K+', label: 'Happy Users' },
              { value: '10s', label: 'Avg Generation' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent mb-2">
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
              Everything you need to create stunning AI-generated art
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Wand2 className="h-6 w-6" />,
                title: 'Text to Image',
                description: 'Describe your vision and watch it come to life in seconds with our advanced AI.',
                gradient: 'from-pink-500 to-rose-500'
              },
              {
                icon: <Palette className="h-6 w-6" />,
                title: 'Multiple Styles',
                description: 'Choose from photorealistic, oil painting, digital art, anime, and many more styles.',
                gradient: 'from-violet-500 to-purple-500'
              },
              {
                icon: <Layers className="h-6 w-6" />,
                title: 'High Resolution',
                description: 'Generate images up to 4K resolution with incredible detail and clarity.',
                gradient: 'from-indigo-500 to-blue-500'
              },
              {
                icon: <RefreshCw className="h-6 w-6" />,
                title: 'Variations',
                description: 'Generate multiple variations of any image and choose your favorite.',
                gradient: 'from-cyan-500 to-teal-500'
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: 'Lightning Fast',
                description: 'Get your images in under 10 seconds. No waiting, just creating.',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: <DownloadCloud className="h-6 w-6" />,
                title: 'Easy Export',
                description: 'Download in any format — PNG, JPG, WebP, or SVG. Share instantly.',
                gradient: 'from-green-500 to-emerald-500'
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
      <section className="relative z-10 py-24 bg-gradient-to-b from-transparent via-pink-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Create stunning artwork in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Describe Your Vision',
                description: 'Type a detailed description of the image you want to create',
                icon: <Brush className="h-8 w-8" />
              },
              {
                step: '02',
                title: 'AI Generation',
                description: 'Our AI transforms your words into breathtaking artwork',
                icon: <Sparkles className="h-8 w-8" />
              },
              {
                step: '03',
                title: 'Download & Share',
                description: 'Download your creation or share it directly on social media',
                icon: <DownloadCloud className="h-8 w-8" />
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 blur-xl opacity-30 rounded-full"></div>
                  <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white/10 border border-white/20 rounded-2xl">
                    {item.icon}
                  </div>
                </div>
                <div className="text-pink-400 text-sm font-mono mb-2">{item.step}</div>
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
          <div className="relative p-12 bg-gradient-to-r from-pink-600 to-violet-600 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create Magic?</h2>
              <p className="text-pink-100 mb-8 max-w-xl mx-auto">
                Join millions of creators bringing their imagination to life. 
                Start generating stunning artwork today.
              </p>
              <Button size="lg" variant="secondary" className="group">
                Start Creating Free
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
              <div className="p-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl">
                <ImageIcon className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">AI Image Generator</span>
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
