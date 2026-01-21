import React from 'react';

export function Button({ children, onClick, variant = 'primary', size = 'md', disabled = false, loading = false, className = '' }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  size?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  const sizes: Record<string, string> = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-base', lg: 'px-6 py-3 text-lg' };

  return React.createElement('button', {
    className: baseStyles + ' ' + variants[variant] + ' ' + sizes[size] + ' ' + className,
    onClick,
    disabled: disabled || loading,
  }, loading && React.createElement('svg', {
    className: 'animate-spin -ml-1 mr-2 h-4 w-4',
    fill: 'none',
    viewBox: '0 0 24 24'
  }, React.createElement('circle', { className: 'opacity-25', cx: '12', cy: '12', r: '10', stroke: 'currentColor', strokeWidth: '4' }),
    React.createElement('path', { className: 'opacity-75', fill: 'currentColor', d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' })), children);
}

export function LoadingSpinner({ size = 'md', className = '' }: { size?: string; className?: string }) {
  const sizes: Record<string, string> = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return React.createElement('div', { className: 'flex items-center justify-center ' + className },
    React.createElement('svg', { className: 'animate-spin ' + sizes[size] + ' text-blue-600', fill: 'none', viewBox: '0 0 24 24' },
      React.createElement('circle', { className: 'opacity-25', cx: '12', cy: '12', r: '10', stroke: 'currentColor', strokeWidth: '4' }),
      React.createElement('path', { className: 'opacity-75', fill: 'currentColor', d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' })));
}

export function ErrorAlert({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return React.createElement('div', { className: 'bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3' },
    React.createElement('svg', { className: 'h-5 w-5 text-red-500 flex-shrink-0 mt-0.5', fill: 'currentColor', viewBox: '0 0 20 20' },
      React.createElement('path', { fillRule: 'evenodd', d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z', clipRule: 'evenodd' })),
    React.createElement('div', { className: 'flex-1' }, React.createElement('p', { className: 'text-sm text-red-700' }, message)),
    onDismiss && React.createElement('button', { onClick: onDismiss, className: 'text-red-500 hover:text-red-700' },
      React.createElement('svg', { className: 'h-5 w-5', fill: 'currentColor', viewBox: '0 0 20 20' },
        React.createElement('path', { fillRule: 'evenodd', d: 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z', clipRule: 'evenodd' }))));
}

export function ProviderSelector({ provider, onChange }: { provider: string; onChange: (p: string) => void }) {
  const providers = [
    { id: 'minimax', name: 'MiniMax', color: 'bg-purple-500' },
    { id: 'deepseek', name: 'DeepSeek', color: 'bg-cyan-500' },
    { id: 'gemini', name: 'Gemini', color: 'bg-yellow-500' },
  ];
  return React.createElement('div', { className: 'flex items-center gap-2' },
    React.createElement('span', { className: 'text-sm text-gray-500' }, 'Provider:'),
    React.createElement('div', { className: 'flex gap-1' },
      providers.map((p) => React.createElement('button', {
        key: p.id,
        onClick: () => onChange(p.id),
        className: 'px-3 py-1 rounded-full text-sm font-medium transition-all ' + (provider === p.id ? p.color + ' text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
      }, p.name))));
}

export function MessageBubble({ role, content, provider }: { role: string; content: string; provider?: string }) {
  const isUser = role === 'user';
  return React.createElement('div', { className: 'flex ' + (isUser ? 'justify-end' : 'justify-start') + ' mb-4' },
    React.createElement('div', { className: 'max-w-[80%] ' + (isUser ? 'order-2' : 'order-1') },
      React.createElement('div', { className: 'px-4 py-2 rounded-2xl ' + (isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800') },
        React.createElement('p', { className: 'whitespace-pre-wrap' }, content)),
      provider && React.createElement('p', { className: 'text-xs text-gray-500 mt-1 ' + (isUser ? 'text-right' : '') }, provider)));
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return React.createElement('div', { className: 'bg-white rounded-xl shadow-md border border-gray-200 p-6 ' + className }, children);
}

export function Input({ value, onChange, placeholder = '', type = 'text', className = '', disabled = false }: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
}) {
  return React.createElement('input', {
    type,
    value,
    placeholder,
    disabled,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    className: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ' + className,
  });
}

type ChatMessage = { role: string; content: string; provider?: string };

export function ChatWindow({ messages, onSend, isLoading, provider, onProviderChange }: {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  isLoading: boolean;
  provider: string;
  onProviderChange: (provider: string) => void;
}) {
  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  const providerOptions = [
    { id: 'minimax', name: 'MiniMax' },
    { id: 'deepseek', name: 'DeepSeek' },
    { id: 'gemini', name: 'Gemini' },
  ];

  // Create message elements
  const messageElements = messages.map((msg, idx) => {
    const isUser = msg.role === 'user';
    return React.createElement('div', {
      key: idx,
      className: 'flex ' + (isUser ? 'justify-end' : 'justify-start') + ' mb-4'
    },
      React.createElement('div', { className: 'max-w-[80%] ' + (isUser ? 'order-2' : 'order-1') },
        React.createElement('div', { className: 'px-4 py-2 rounded-2xl ' + (isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800') },
          React.createElement('p', { className: 'whitespace-pre-wrap' }, msg.content)),
        msg.provider && React.createElement('p', { className: 'text-xs text-gray-500 mt-1', style: { textAlign: isUser ? 'right' : 'left' } }, msg.provider)
      )
    );
  });

  // Loading indicator
  const loadingElement = isLoading ? React.createElement('div', { className: 'flex justify-start mb-4' },
    React.createElement('div', { className: 'bg-gray-100 rounded-2xl px-4 py-2' },
      React.createElement('div', { className: 'flex space-x-1' },
        React.createElement('div', { className: 'w-2 h-2 bg-gray-500 rounded-full animate-bounce' }),
        React.createElement('div', { className: 'w-2 h-2 bg-gray-500 rounded-full animate-bounce', style: { animationDelay: '0.1s' } }),
        React.createElement('div', { className: 'w-2 h-2 bg-gray-500 rounded-full animate-bounce', style: { animationDelay: '0.2s' } })
      )
    )
  ) : null;

  // Provider select
  const providerSelect = React.createElement('select', {
    value: provider,
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onProviderChange(e.target.value),
    className: 'px-2 py-1 text-sm border border-gray-300 rounded-lg'
  },
    providerOptions.map((p) => React.createElement('option', { key: p.id, value: p.id }, p.name))
  );

  // Header
  const header = React.createElement('div', { className: 'flex items-center justify-between px-4 py-3 border-b' },
    React.createElement('h2', { className: 'font-semibold' }, 'Chat'),
    React.createElement('div', { className: 'flex items-center gap-2' },
      React.createElement('span', { className: 'text-sm text-gray-500' }, 'Provider:'),
      providerSelect
    )
  );

  // Messages container
  const messagesContainer = React.createElement('div', { className: 'flex-1 overflow-y-auto p-4' },
    messageElements,
    loadingElement,
    React.createElement('div', { ref: messagesEndRef })
  );

  // Input form
  const inputForm = React.createElement('form', { onSubmit: handleSubmit, className: 'p-4 border-t' },
    React.createElement('div', { className: 'flex gap-2' },
      React.createElement('input', {
        type: 'text',
        value: input,
        onChange: (e) => setInput(e.target.value),
        placeholder: 'Type your message...',
        disabled: isLoading,
        className: 'flex-1 px-4 py-2 border border-gray-300 rounded-lg'
      }),
      React.createElement('button', {
        type: 'submit',
        disabled: !input.trim() || isLoading,
        className: 'px-4 py-2 bg-blue-600 text-white rounded-lg'
      }, 'Send')
    )
  );

  // Main container
  return React.createElement('div', { className: 'flex flex-col h-full bg-white rounded-xl shadow-md border' },
    header,
    messagesContainer,
    inputForm
  );
}
