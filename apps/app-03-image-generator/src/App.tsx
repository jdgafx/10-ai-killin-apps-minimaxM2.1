import React, { useState, useCallback } from 'react';
import { minimaxTextToImage } from '@packages/ai-providers';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from '@packages/shared-ui';
import { Image, Download, Palette, Maximize2, Zap, History, Trash2, Copy } from 'lucide-react';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  createdAt: Date;
}

const STYLES = [
  { id: 'realistic', name: 'Realistic', icon: '📷' },
  { id: 'anime', name: 'Anime', icon: '🎨' },
  { id: 'abstract', name: 'Abstract', icon: '🎭' },
  { id: 'digital-art', name: 'Digital Art', icon: '✨' },
  { id: 'oil-painting', name: 'Oil Painting', icon: '🖼️' },
  { id: 'watercolor', name: 'Watercolor', icon: '💧' },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: '🤖' },
  { id: 'fantasy', name: 'Fantasy', icon: '🐉' },
];

const ASPECT_RATIOS = [
  { id: '1:1', name: 'Square', label: '1:1' },
  { id: '16:9', name: 'Landscape', label: '16:9' },
  { id: '4:3', name: 'Standard', label: '4:3' },
  { id: '2:3', name: 'Portrait', label: '2:3' },
  { id: '9:16', name: 'Story', label: '9:16' },
];

function App() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const generateImage = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentImage(null);

    try {
      const fullPrompt = `${prompt}. Style: ${style}`.trim();
      const urls = await minimaxTextToImage(fullPrompt, {
        aspectRatio,
        n: 1,
      });

      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        url: urls[0],
        prompt,
        style,
        aspectRatio,
        createdAt: new Date(),
      };

      setImages((prev) => [newImage, ...prev]);
      setCurrentImage(urls[0]);
      setHistory((prev) => [prompt, ...prev.filter((p) => p !== prompt)].slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, style, aspectRatio]);

  const downloadImage = useCallback(async (url: string, prompt: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `generated-${prompt.substring(0, 30).replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setError('Failed to download image');
    }
  }, []);

  const copyPrompt = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const usePrompt = useCallback((text: string) => {
    setPrompt(text);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
              <Image className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Image Generator</h1>
              <p className="text-sm text-gray-500">Create stunning images with AI</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <Card className="lg:col-span-1 h-fit">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Generate Image
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to create..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{prompt.length}/500 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                <div className="grid grid-cols-4 gap-2">
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`p-2 rounded-lg text-center transition-all ${
                        style === s.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title={s.name}
                    >
                      <span className="text-xl">{s.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
                <div className="grid grid-cols-5 gap-2">
                  {ASPECT_RATIOS.map((ar) => (
                    <button
                      key={ar.id}
                      onClick={() => setAspectRatio(ar.id)}
                      className={`p-2 rounded-lg text-center transition-all ${
                        aspectRatio === ar.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title={ar.name}
                    >
                      <span className="text-xs font-medium">{ar.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={generateImage} loading={isGenerating} disabled={!prompt.trim()} className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Recent Prompts
                </h3>
                <div className="space-y-1">
                  {history.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => usePrompt(h)}
                      className="w-full text-left text-sm text-gray-600 p-2 rounded hover:bg-gray-100 truncate"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Preview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="min-h-[400px] flex items-center justify-center">
              {isGenerating ? (
                <div className="text-center">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4 text-gray-500">Generating your image...</p>
                </div>
              ) : currentImage ? (
                <div className="w-full">
                  <img
                    src={currentImage}
                    alt="Generated"
                    className="w-full rounded-lg shadow-lg"
                  />
                  <div className="mt-4 flex gap-2 justify-center">
                    <Button onClick={() => downloadImage(currentImage, prompt)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" onClick={() => copyPrompt(prompt)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Prompt
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <Image className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Enter a prompt and click Generate to create an image</p>
                </div>
              )}
            </Card>

            {/* Gallery */}
            {images.length > 0 && (
              <Card>
                <h2 className="font-semibold text-gray-800 mb-4">Generated Images</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      onClick={() => setCurrentImage(img.url)}
                      className="relative group cursor-pointer"
                    >
                      <img
                        src={img.url}
                        alt={img.prompt}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); downloadImage(img.url, img.prompt); }}
                          className="p-2 bg-white rounded-full hover:bg-gray-100"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">{img.prompt}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
