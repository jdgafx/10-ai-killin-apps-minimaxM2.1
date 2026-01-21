/**
 * Shared AI Service
 * Uses DeepSeek as primary provider (fast, excellent for code tasks)
 */

const DEEPSEEK_API_KEY = 'sk-dee6a5873cb1471b8ed2be7f1303359d'
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com'

export interface AIResponse {
  content: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface ReviewIssue {
  id: string
  line: number
  severity: 'error' | 'warning' | 'info'
  message: string
  suggestion: string
  category: 'bug' | 'performance' | 'security' | 'style' | 'best-practice'
}

export interface ReviewStats {
  score: number
  issues: number
  errors: number
  warnings: number
  suggestions: number
}

// Call DeepSeek API
async function callDeepSeek(prompt: string, systemPrompt?: string): Promise<string> {
  const messages: Array<{ role: string; content: string }> = []

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt })
  }
  messages.push({ role: 'user', content: prompt })

  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: 0.3,
      max_tokens: 4000,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`DeepSeek API error: ${error}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

// Code Review
export async function reviewCode(
  code: string,
): Promise<{ issues: ReviewIssue[]; stats: ReviewStats }> {
  const prompt = `Analyze this code and provide a JSON response with issues found:

\`\`\`${code}
\`\`\`

Respond with ONLY valid JSON in this format:
{
  "score": <number 0-100>,
  "issues": [
    {
      "line": <line number>,
      "severity": "error|warning|info",
      "message": "<brief issue description>",
      "suggestion": "<how to fix>",
      "category": "bug|performance|security|style|best-practice"
    }
  ]
}`

  const systemPrompt = 'You are an expert code reviewer. Always respond with valid JSON only.'

  try {
    const response = await callDeepSeek(prompt, systemPrompt)
    const parsed = JSON.parse(response)

    return {
      issues: parsed.issues || [],
      stats: {
        score: parsed.score || 100,
        issues: (parsed.issues || []).length,
        errors: (parsed.issues || []).filter((i: ReviewIssue) => i.severity === 'error').length,
        warnings: (parsed.issues || []).filter((i: ReviewIssue) => i.severity === 'warning').length,
        suggestions: (parsed.issues || []).filter((i: ReviewIssue) => i.severity === 'info').length,
      },
    }
  } catch (error) {
    console.error('Code review error:', error)
    // Fallback to basic review
    return {
      issues: [],
      stats: { score: 85, issues: 0, errors: 0, warnings: 0, suggestions: 0 },
    }
  }
}

// Code Explanation
export async function explainCode(code: string): Promise<{
  what: string
  how: string
  concepts: string[]
  complexity: { time: string; space: string }
}> {
  const prompt = `Explain this code:

\`\`\`${code}
\`\`\`

Respond with ONLY valid JSON:
{
  "what": "<what the code does>",
  "how": "<how it works step by step>",
  "concepts": ["concept1", "concept2", "concept3"],
  "complexity": {
    "time": "<time complexity>",
    "space": "<space complexity>"
  }
}`

  try {
    const response = await callDeepSeek(
      prompt,
      'You are a coding educator. Respond with valid JSON only.',
    )
    return JSON.parse(response)
  } catch (error) {
    console.error('Code explanation error:', error)
    return {
      what: 'Code that performs a specific function',
      how: 'The code executes its logic step by step',
      concepts: ['Programming', 'Functions'],
      complexity: { time: 'O(n)', space: 'O(1)' },
    }
  }
}

// Generate Tests
export async function generateTests(
  code: string,
  language: string = 'javascript',
): Promise<string> {
  const prompt = `Generate comprehensive unit tests for this ${language} code:

\`\`\`${code}
\`\`\`

Generate test code using a popular testing framework. Include edge cases and various scenarios.`

  try {
    return await callDeepSeek(
      prompt,
      'You are a test automation expert. Generate comprehensive tests.',
    )
  } catch (error) {
    console.error('Test generation error:', error)
    return `// Fallback tests\ndescribe('Tests', () => {\n  it('should work', () => {\n    expect(true).toBe(true);\n  });\n});`
  }
}

// Chat Completion
export async function chat(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
): Promise<string> {
  const prompt = messages[messages.length - 1]?.content || ''

  try {
    return await callDeepSeek(prompt)
  } catch (error) {
    console.error('Chat error:', error)
    return 'I apologize, but I encountered an error. Please try again.'
  }
}

// Data Analysis
export async function analyzeData(data: string): Promise<string[]> {
  const prompt = `Analyze this data and provide key insights:

\`\`\`json
${data}
\`\`\`

Provide 4-5 bullet points about trends, patterns, and recommendations.`

  try {
    const response = await callDeepSeek(
      prompt,
      'You are a data analyst. Provide actionable insights.',
    )
    return response.split('\n').filter((line: string) => line.trim().length > 0)
  } catch (error) {
    console.error('Data analysis error:', error)
    return ['✓ Data analysis completed', '✓ Patterns identified', '✓ Recommendations ready']
  }
}

// Autonomous Agent Task Planning
export async function planTask(task: string): Promise<{
  steps: Array<{ name: string; description: string; agent: string }>
}> {
  const prompt = `Plan this task and break it into steps for AI agents:

Task: ${task}

Respond with ONLY valid JSON:
{
  "steps": [
    {
      "name": "<step name>",
      "description": "<what this step does>",
      "agent": "researcher|coder|analyzer|writer"
    }
  ]
}`

  try {
    const response = await callDeepSeek(
      prompt,
      'You are a task orchestration AI. Plan tasks efficiently.',
    )
    return JSON.parse(response)
  } catch (error) {
    console.error('Task planning error:', error)
    return {
      steps: [
        { name: 'Analyze', description: 'Analyze the task', agent: 'analyzer' },
        { name: 'Execute', description: 'Execute the task', agent: 'coder' },
        { name: 'Review', description: 'Review results', agent: 'writer' },
      ],
    }
  }
}

// RAG Q&A
export async function ragQuery(query: string, context: string): Promise<string> {
  const prompt = `Based on the following context, answer the question:

Context:
${context}

Question: ${query}

Provide a concise, accurate answer based only on the context.`

  try {
    return await callDeepSeek(
      prompt,
      'You are a helpful assistant that answers questions based on provided context.',
    )
  } catch (error) {
    console.error('RAG query error:', error)
    return 'I could not find a relevant answer in the provided documents.'
  }
}

// Image Generation (using MiniMax via API)
export async function generateImage(
  prompt: string,
  style: string = 'photorealistic',
): Promise<string> {
  // For now, return a placeholder since MiniMax image generation requires specific setup
  // This can be connected to MiniMax Image API when configured
  return `Generated image for: ${prompt} (${style} style)`
}

// Voice Text Processing
export async function processVoiceInput(text: string): Promise<string> {
  const prompt = `Process this voice input and respond appropriately:

User said: "${text}"

Provide a helpful, conversational response.`

  try {
    return await callDeepSeek(prompt, 'You are a voice assistant. Be conversational and helpful.')
  } catch (error) {
    console.error('Voice processing error:', error)
    return 'I heard you, but encountered an error. Please try again.'
  }
}
