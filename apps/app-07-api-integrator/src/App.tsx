import React, { useState, useCallback } from 'react';
import { useAIProvider } from '@packages/ai-providers';
import { Card, Button, LoadingSpinner, ErrorAlert, ProviderSelector } from '@packages/shared-ui';
import { 
  Globe, 
  Play, 
  History, 
  Settings, 
  Clock,
  CheckCircle,
  XCircle,
  Copy,
  ChevronRight,
  Database
} from 'lucide-react';

interface RequestEntry {
  id: string;
  timestamp: Date;
  provider: string;
  model: string;
  request: { messages: Message[] };
  response: any;
  duration: number;
  status: 'success' | 'error';
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([{ role: 'user', content: 'Hello, how are you?' }]);
  const [provider, setProvider] = useState('minimax');
  const [isSending, setIsSending] = useState(false);
  const [history, setHistory] = useState<RequestEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { chat, streamChat, isLoading } = useAIProvider();

  const sendRequest = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const userMsg: Message = { role: 'user', content: message };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsSending(true);
    setError(null);

    const startTime = Date.now();
    let response: any;
    let status: 'success' | 'error' = 'success';

    try {
      const result = await chat(newMessages);
      response = result;
      const assistantMsg: Message = { role: 'assistant', content: result };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      status = 'error';
      setError(err instanceof Error ? err.message : 'Request failed');
      response = { error: err instanceof Error ? err.message : 'Unknown error' };
    } finally {
      const duration = Date.now() - startTime;
      setIsSending(false);

      const entry: RequestEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        provider,
        model: provider === 'minimax' ? 'minimax-abab6.5' : 'deepseek-chat',
        request: { messages: newMessages },
        response,
        duration,
        status,
      };

      setHistory((prev) => [entry, ...prev].slice(0, 50));
    }
  }, [messages, provider, chat]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const retryRequest = useCallback((entry: RequestEntry) => {
    setMessages(entry.request.messages);
    setProvider(entry.provider);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-600" />
            API Playground
          </h1>
          <p className="text-sm text-gray-500 mt-1">Test AI providers</p>
        </div>

        <div className="p-4 border-b">
          <ProviderSelector provider={provider} onChange={setProvider} />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-600">Request History</h2>
            {history.length > 0 && (
              <button onClick={clearHistory} className="text-xs text-red-600 hover:text-red-700">
                Clear
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No requests yet</p>
          ) : (
            <div className="space-y-2">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => retryRequest(entry)}
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700 capitalize">{entry.provider}</span>
                    <span className="text-xs text-gray-400">{entry.duration}ms</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {entry.request.messages[entry.request.messages.length - 1]?.content}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {entry.status === 'success' ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500" />
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-800">Chat</h2>
              <p className="text-sm text-gray-500">
                Provider: {provider} • Model: {provider === 'minimax' ? 'minimax-abab6.5' : 'deepseek-chat'}
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {(isLoading || isSending) && (
              <div className="flex items-center gap-2 text-gray-500">
                <LoadingSpinner size="sm" />
                <span>AI is thinking...</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="px-6 pb-4">
            <ErrorAlert message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        <div className="p-4 border-t bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <input
                id="message-input"
                type="text"
                placeholder="Send a message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const input = e.currentTarget;
                    sendRequest(input.value);
                    input.value = '';
                  }
                }}
              />
              <Button
                onClick={() => {
                  const input = document.getElementById('message-input') as HTMLInputElement;
                  if (input) {
                    sendRequest(input.value);
                    input.value = '';
                  }
                }}
                loading={isLoading || isSending}
              >
                <Play className="h-4 w-4 mr-2" />
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
