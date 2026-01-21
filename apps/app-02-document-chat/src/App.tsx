import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useAIProvider } from '@packages/ai-providers';
import { Card, Button, Input, LoadingSpinner, ErrorAlert, ChatWindow } from '@packages/shared-ui';
import { FileText, Upload, Trash2, Search, Plus, BookOpen, MessageCircle } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  content: string;
  chunks: number;
  indexed: boolean;
  uploadedAt: Date;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  provider?: string;
  timestamp: string;
  context?: { document: string; chunk: string; similarity: number }[];
}

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [provider, setProvider] = useState('minimax');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { chat, streamChat, isLoading, error } = useAIProvider();

  // Simple RAG implementation using localStorage
  const [vectorStore, setVectorStore] = useState<Map<string, number[]>>(new Map());

  const generateEmbedding = useCallback(async (text: string): Promise<number[]> => {
    // Simple embedding: hash-based + character frequency
    const chars = text.toLowerCase().split('');
    const embedding = new Array(100).fill(0);
    chars.forEach((char, i) => {
      embedding[char.charCodeAt(0) % 100] += 1;
    });
    // Normalize
    const norm = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0)) || 1;
    return embedding.map(v => v / norm);
  }, []);

  const cosineSimilarity = (a: number[], b: number[]): number => {
    const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0)) || 1;
    const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0)) || 1;
    return dot / (normA * normB);
  };

  const searchContext = useCallback(async (query: string, topK = 3): Promise<{ document: string; chunk: string; similarity: number }[]> => {
    const queryEmbedding = await generateEmbedding(query);
    const results: { document: string; chunk: string; similarity: number }[] = [];

    for (const doc of documents) {
      if (!doc.indexed) continue;
      const chunks = doc.content.split(/\n\n+/).filter(c => c.length > 50);
      for (const chunk of chunks) {
        const chunkEmbedding = await generateEmbedding(chunk);
        const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);
        results.push({
          document: doc.name,
          chunk: chunk.substring(0, 200) + '...',
          similarity,
        });
      }
    }

    return results.sort((a, b) => b.similarity - a.similarity).slice(0, topK);
  }, [documents, generateEmbedding]);

  const handleUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    for (const file of Array.from(files)) {
      const text = await file.text();
      const chunks = text.split(/\n\n+/).filter(c => c.length > 50).length;
      
      const doc: Document = {
        id: crypto.randomUUID(),
        name: file.name,
        content: text,
        chunks,
        indexed: false,
        uploadedAt: new Date(),
      };

      setDocuments((prev) => [...prev, doc]);

      // Index the document
      const embeddings = new Map<string, number[]>();
      const textChunks = text.split(/\n\n+/).filter(c => c.length > 50);
      for (let i = 0; i < textChunks.length; i++) {
        const embedding = await generateEmbedding(textChunks[i]);
        embeddings.set(`${doc.id}-chunk-${i}`, embedding);
      }

      setVectorStore((prev) => {
        const next = new Map(prev);
        embeddings.forEach((v, k) => next.set(k, v));
        return next;
      });

      setDocuments((prev) => prev.map((d) => d.id === doc.id ? { ...d, indexed: true } : d));
    }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [generateEmbedding]);

  const handleSend = useCallback(async (message: string) => {
    const userMsg: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Search for relevant context
    const context = await searchContext(message);
    const contextText = context.length > 0
      ? `\n\nRelevant context from your documents:\n${context.map((c, i) => `[${i + 1}] From ${c.document} (relevance: ${(c.similarity * 100).toFixed(1)}%):\n${c.chunk}`).join('\n\n')}`
      : '';

    const systemPrompt = `You are a helpful assistant answering questions about uploaded documents. Use the provided context to give accurate, helpful responses. Always cite which document you're referring to when possible.`;

    try {
      let response = '';
      
      await streamChat(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Question: ${message}${contextText}` },
        ],
        (token) => {
          response += token;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last.role === 'user') {
              return [...prev, {
                role: 'assistant',
                content: response,
                timestamp: new Date().toLocaleTimeString(),
                provider,
                context: context.length > 0 ? context : undefined,
              }];
            }
            return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: response } : m);
          });
        }
      );
    } catch (err) {
      console.error('Chat error:', err);
    }
  }, [provider, streamChat, searchContext]);

  const deleteDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    setSelectedDoc(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            Document Chat
          </h1>
          <p className="text-sm text-gray-500 mt-1">Upload documents and chat with them</p>
        </div>

        <div className="p-4 border-b">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            multiple
            accept=".txt,.md,.json,.js,.ts,.jsx,.tsx,.py,.html,.css"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            loading={isUploading}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Documents
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-sm font-semibold text-gray-600 mb-3">Your Documents</h2>
          {documents.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No documents uploaded yet</p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedDoc === doc.id ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                  } border`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-sm text-gray-800 truncate max-w-[180px]">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.chunks} chunks • {doc.indexed ? 'Indexed' : 'Indexing...'}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteDocument(doc.id); }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MessageCircle className="h-6 w-6 text-blue-600" />
            <h2 className="font-semibold text-gray-800">
              {selectedDoc ? documents.find(d => d.id === selectedDoc)?.name : 'All Documents'}
            </h2>
          </div>
        </header>

        <div className="flex-1 p-6">
          <ChatWindow
            messages={messages}
            onSend={handleSend}
            isLoading={isLoading}
            provider={provider}
            onProviderChange={setProvider}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
