import { useState, useCallback, useRef } from 'react';

export function useAIProvider() {
  const [isLoading, setIsLoading] = useState(false);
  
  const chat = useCallback(async (messages: { role: string; content: string }[]): Promise<string> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    
    return `**Voice Response:**

[Audio would play here]

Transcribed text: "${lastUserMessage}"

This is a simulated voice assistant response. In production with proper API configuration:
1. Speech-to-text converts your voice to text
2. AI processes the query
3. Text-to-speech generates the audio response

Configure VITE_MINIMAX_API_KEY for full voice functionality.`;
  }, []);
  
  return { chat, isLoading };
}

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Handle audio data
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }, []);
  
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setTranscript('Simulated transcript: Hello, this is a test voice message.');
    }
  }, []);
  
  return { isRecording, transcript, startRecording, stopRecording };
}
