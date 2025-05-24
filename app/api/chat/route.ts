import { createResource } from "@/lib/actions/resources";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, tool } from "ai";
import { z } from "zod";
import { findRelevantContent } from "@/lib/ai/embedding";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const result = streamText({
    model: openrouter("anthropic/claude-3.5-sonnet-20240620"),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.Only respond to questions using information from tool calls.if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    messages,
    tools: {
      weather: tool({
        description: "Get the weather in a location",
        parameters: z.object({
          location: z.string().describe("The location to get the weather for"),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
      convertFahrenheitToCelsius: tool({
        description: "Convert a temperature in  Fahrenheit to Celsius",
        parameters: z.object({
          temperature: z
            .number()
            .describe("The temperature in Fahrenheit to convert to Celsius"),
        }),
        execute: async ({ temperature }) => {
          const celsius = Math.round((temperature - 32) * (5 / 9));
          return {
            celsius,
          };
        },
      }),
      addResource: tool({
        description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        parameters: z.object({
          content: z
            .string()
            .describe("the content or resource to add to the knowledge base"),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    },
  });

  return result.toDataStreamResponse();
}
