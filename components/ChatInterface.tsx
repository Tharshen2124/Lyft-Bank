// components/ChatInterface.tsx
'use client';

import { useState } from 'react';
import { useClaude } from '@/hooks/useClaude';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, clearMessages, isLoading, error } = useClaude({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    streaming: true, // Set to false for non-streaming
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    await sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Claude Chat</h1>
        <button
          onClick={clearMessages}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-100 ml-auto max-w-[80%]'
                : 'bg-gray-100 mr-auto max-w-[80%]'
            }`}
          >
            <div className="font-semibold mb-1">
              {message.role === 'user' ? 'You' : 'Claude'}
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-100 p-4 rounded-lg mr-auto max-w-[80%]">
            <div className="font-semibold mb-1">Claude</div>
            <div className="animate-pulse">Thinking...</div>
          </div>
        )}
        {error && (
          <div className="bg-red-100 p-4 rounded-lg text-red-700">
            Error: {error}
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}