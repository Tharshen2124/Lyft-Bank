// hooks/useClaude.ts
'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UseClaudeOptions {
  model?: string;
  max_tokens?: number;
  streaming?: boolean;
}

export function useClaude(options: UseClaudeOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (userMessage: string) => {
    setIsLoading(true);
    setError(null);

    // Add user message to history
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);

    try {
      if (options.streaming) {
        // Handle streaming response
        const response = await fetch('/api/chat/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages,
            model: options.model,
            max_tokens: options.max_tokens,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = JSON.parse(line.slice(6));
                
                if (data.type === 'content_block_delta' && data.delta?.text) {
                  assistantMessage += data.delta.text;
                  // Update messages with partial response
                  setMessages([...newMessages, { 
                    role: 'assistant', 
                    content: assistantMessage 
                  }]);
                }
              }
            }
          }
        }
      } else {
        // Handle non-streaming response
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages,
            model: options.model,
            max_tokens: options.max_tokens,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const assistantMessage = data.content[0].text;

        setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading,
    error,
  };
}