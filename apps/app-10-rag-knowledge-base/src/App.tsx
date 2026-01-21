import React, { useState, useCallback, useEffect } from 'react';
import { useAIProvider } from '@packages/ai-providers';
import { Card, Button, Input, LoadingSpinner, ErrorAlert } from '@packages/shared-ui';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Trash2, 
  Upload, 
  Download,
  Tag,
  FileText,
  Search as SearchIcon,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  content: string;
  tags: string[];
  chunks: number;
  createdAt: Date;
}

interface SearchResult {
  documentId: string;
  title: string;
  chunk: string;
  relevance: number;
  tags: string[];
}

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [newDocTags, setNewDocTags] = useState('');

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Simple vector store using localStorage
  const [vectorIndex, setVectorIndex] = useState<Map<string, number[]>>(new Map());

  const generateEmbedding = useCallback(async (text: string): Promise<number[]> => {
    const chars = text.toLowerCase().split('');
    const embedding = new Array(100).fill(0);
    chars.forEach((char, i) => {
      embedding[char.charCodeAt(0) % 100] += 1;
    });
    const norm = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0)) || 1;
    return embedding.map(v => v / norm);
  }, []);

  const cosineSimilarity = (a: number[], b: number[]): number => {
    const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0)) || 1;
    const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0)) || 1;
    return dot / (normA * normB);
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsIndexing(true);
    for (const file of Array.from(files)) {
      const text = await file.text();
      const chunks = text.split(/\n\n+/).filter((c: string) => c.length > 50);

      const doc: Document = {
        id: crypto.randomUUID(),
        title: file.name,
        content: text,
        tags: ['uploaded'],
        chunks: chunks.length,
        createdAt: new Date(),
      };

      setDocuments((prev) => [...prev, doc]);

      // Index chunks
      const embeddings = new Map<string, number[]>();
      for (let i = 0; i < chunks.length; i++) {
        const embedding = await generateEmbedding(chunks[i]);
        embeddings.set(`${doc.id}-chunk-${i}`, embedding);
      }

      setVectorIndex((prev) => {
        const next = new Map(prev);
        embeddings.forEach((v, k) => next.set(k, v));
        return next;
      });
    }
    setIsIndexing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [generateEmbedding]);

  const addDocument = useCallback(() => {
    if (!newDocTitle.trim() || !newDocContent.trim()) {
      setError('Please enter both title and content');
      return;
    }

    const chunks = newDocContent.split(/\n\n+/).filter(c => c.length > 50);
    const doc: Document = {
      id: crypto.randomUUID(),
      title: newDocTitle,
      content: newDocContent,
      tags: newDocTags.split(',').map(t => t.trim()).filter(Boolean),
      chunks: chunks.length,
      createdAt: new Date(),
    };

    setDocuments((prev) => [...prev, doc]);
    setNewDocTitle('');
    setNewDocContent('');
    setNewDocTags('');
    setShowAddModal(false);
  }, [newDocTitle, newDocContent, newDocTags]);

  const deleteDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    setSelectedDoc(null);
  }, []);

  const performSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const queryEmbedding = await generateEmbedding(searchQuery);
    const results: SearchResult[] = [];

    for (const doc of documents) {
      const chunks = doc.content.split(/\n\n+/).filter(c => c.length > 50);
      for (let i = 0; i < chunks.length; i++) {
        const chunkEmbedding = await generateEmbedding(chunks[i]);
        const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);
        if (similarity > 0.1) {
          results.push({
            documentId: doc.id,
            title: doc.title,
            chunk: chunks[i].substring(0, 300) + (chunks[i].length > 300 ? '...' : ''),
            relevance: similarity,
            tags: doc.tags,
          });
        }
      }
    }

    results.sort((a, b) => b.relevance - a.relevance);
    setSearchResults(results.slice(0, 20));
    setIsSearching(false);
  }, [searchQuery, documents, generateEmbedding]);

  useEffect(() => {
    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const exportKB = useCallback(() => {
    const data = {
      documents,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `knowledge-base-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [documents]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-600 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">RAG Knowledge Base</h1>
              <p className="text-sm text-gray-500">Vector search and retrieval</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportKB} disabled={documents.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept=".txt,.md,.json,.js,.ts,.py"
              className="hidden"
            />
            <Button onClick={() => fileInputRef.current?.click()} loading={isIndexing}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <ErrorAlert message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <Card className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your knowledge base..."
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents List */}
          <Card>
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents ({documents.length})
            </h2>
            {documents.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No documents yet</p>
                <p className="text-sm">Upload or add documents to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedDoc?.id === doc.id
                        ? 'bg-blue-50 border-blue-200 border'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{doc.title}</p>
                        <p className="text-xs text-gray-500">{doc.chunks} chunks</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {doc.tags.map((tag, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">
                              {tag}
                            </span>
                          ))}
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
          </Card>

          {/* Search Results / Document View */}
          <Card className="lg:col-span-2">
            {searchQuery ? (
              <>
                <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Results
                  {isSearching && <LoadingSpinner size="sm" />}
                </h2>
                {searchResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <SearchIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No results found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchResults.map((result, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedDoc(documents.find(d => d.id === result.documentId) || null)}
                        className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-800">{result.title}</span>
                          <span className="text-xs px-2 py-0.5 bg-green-200 text-green-700 rounded">
                            {(result.relevance * 100).toFixed(1)}% match
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{result.chunk}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {result.tags.map((tag, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : selectedDoc ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-800">{selectedDoc.title}</h2>
                  <button onClick={() => setSelectedDoc(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">{selectedDoc.content}</pre>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <SearchIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Search or select a document to view</p>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Add Document</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <Input
                  value={newDocTitle}
                  onChange={setNewDocTitle}
                  placeholder="Document title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  placeholder="Paste your document content here..."
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <Input
                  value={newDocTags}
                  onChange={setNewDocTags}
                  placeholder="e.g., documentation, api, guide"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button onClick={addDocument}>Add Document</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default App;
