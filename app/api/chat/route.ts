import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import {streamText} from 'ai'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request){
  const {messages} = await req.json()
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  })
  const result = streamText({
    model: openrouter('anthropic/claude-3.5-sonnet-20240620'),
    messages,
  })

  return result.toDataStreamResponse()
}