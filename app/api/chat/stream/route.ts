// app/api/chat/stream/route.ts
import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, model = 'claude-sonnet-4-20250514', max_tokens = 1024 } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a streaming response
    const stream = await anthropic.messages.stream({
      model,
      max_tokens,
      messages,
    });

    // Convert Anthropic stream to ReadableStream
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            // Send each chunk as Server-Sent Events
            const data = JSON.stringify(chunk);
            controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Claude API Streaming Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: error.status || 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
