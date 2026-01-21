import { useState, useCallback } from 'react'

const PROVIDERS = {
  minimax: {
    baseUrl: 'https://api.minimax.chat/v1',
    model: 'minimax-abab6.5-chat',
  },
  deepseek: {
    baseUrl: 'https://api.deepseek.com',
    model: 'deepseek-chat',
  },
  gemini: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-2.0-flash-exp',
  },
} as const

type Provider = keyof typeof PROVIDERS

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export function useAIProvider(defaultProvider: Provider = 'minimax') {
  const [provider, setProvider] = useState<Provider>(defaultProvider)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getApiKey = () => {
    const keyMap: Record<Provider, string> = {
      minimax: import.meta.env.VITE_MINIMAX_API_KEY || '',
      deepseek: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
      gemini: import.meta.env.VITE_GEMINI_API_KEY || '',
    }
    return keyMap[provider]
  }

  const chat = useCallback(
    async (messages: ChatMessage[]): Promise<string> => {
      setIsLoading(true)
      setError(null)

      const apiKey = getApiKey()
      if (!apiKey) {
        setError(
          `API key not set for ${provider}. Set VITE_${provider.toUpperCase()}_API_KEY in .env`,
        )
        setIsLoading(false)
        return `[${provider.toUpperCase()} API key not configured]`
      }

      const config = PROVIDERS[provider]

      try {
        let response: Response

        if (provider === 'gemini') {
          const contents = messages.map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          }))

          response = await fetch(
            `${config.baseUrl}/models/${config.model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents }),
            },
          )
        } else {
          response = await fetch(`${config.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: config.model,
              messages: messages.map((msg) => ({ role: msg.role, content: msg.content })),
              temperature: 0.7,
              max_tokens: 4096,
            }),
          })
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error?.message || `HTTP ${response.status}`)
        }

        const data = await response.json()
        let content = ''

        if (provider === 'gemini') {
          content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
        } else {
          content = data.choices?.[0]?.message?.content || ''
        }

        setIsLoading(false)
        return content
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)

        if (provider === 'minimax') {
          try {
            const result = await chatWithProvider(messages, 'deepseek')
            return result
          } catch {
            try {
              const result = await chatWithProvider(messages, 'gemini')
              return result
            } catch {
              setIsLoading(false)
              return `[Error: ${message}]`
            }
          }
        }

        setIsLoading(false)
        return `[Error: ${message}]`
      }
    },
    [provider],
  )

  return { chat, isLoading, error, provider, setProvider }
}

async function chatWithProvider(messages: ChatMessage[], provider: Provider): Promise<string> {
  const keyMap: Record<Provider, string> = {
    minimax: import.meta.env.VITE_MINIMAX_API_KEY || '',
    deepseek: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
    gemini: import.meta.env.VITE_GEMINI_API_KEY || '',
  }

  const config = PROVIDERS[provider]
  const apiKey = keyMap[provider]

  if (!apiKey) {
    throw new Error(`API key not set for ${provider}`)
  }

  let response: Response

  if (provider === 'gemini') {
    const contents = messages.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }))

    response = await fetch(
      `${config.baseUrl}/models/${config.model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      },
    )
  } else {
    response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages.map((msg) => ({ role: msg.role, content: msg.content })),
        temperature: 0.7,
        max_tokens: 4096,
      }),
    })
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `HTTP ${response.status}`)
  }

  const data = await response.json()

  if (provider === 'gemini') {
    return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  }
  return data.choices?.[0]?.message?.content || ''
}

export function generateImage(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const apiKey = import.meta.env.VITE_MINIMAX_API_KEY
    if (!apiKey) {
      setTimeout(() => {
        resolve(`https://picsum.photos/seed/${encodeURIComponent(prompt)}/800/600`)
      }, 1000)
      return
    }

    fetch('https://api.minimax.chat/v1/image/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'image-01',
        prompt,
        aspect_ratio: '1:1',
        n: 1,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.images?.[0]?.url) {
          resolve(data.images[0].url)
        } else {
          resolve(`https://picsum.photos/seed/${encodeURIComponent(prompt)}/800/600`)
        }
      })
      .catch(() => {
        resolve(`https://picsum.photos/seed/${encodeURIComponent(prompt)}/800/600`)
      })
  })
}
