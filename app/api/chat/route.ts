import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  const result = streamText({
    model: openrouter("anthropic/claude-3.5-sonnet-20240620"),
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
    },
  });

  return result.toDataStreamResponse();
}
