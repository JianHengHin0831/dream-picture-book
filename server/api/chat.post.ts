import { ok } from "assert";
import { stat } from "fs";
import { defineEventHandler, readBody } from "h3";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
  characterName: string;
  characterDescription: string;
}

interface SsePayload {
  type: "text_chunk" | "image_url" | "done";
  content?: string;
}

async function generateImage(prompt: string, apiKey: string): Promise<string> {
  try {
    // const response = await fetch(
    //   "https://api.openai.com/v1/images/generations",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${apiKey}`,
    //     },
    //     body: JSON.stringify({
    //       model: "dall-e-3",
    //       prompt: prompt,
    //       n: 1,
    //       size: "1024x1024",
    //       quality: "standard",
    //     }),
    //   }
    // );
    const response = {
      ok: true,
      statusText: "OK",
      json: async () => ({
        data: [{ url: "https://example.com/generated-image.png" }],
      }),
    };

    if (!response.ok) {
      throw new Error(`DALL-E API error: ${response.statusText}`);
    }
    const data = (await response.json()) as { data: Array<{ url: string }> };
    return data.data[0]?.url || "";
  } catch (error) {
    console.error("Failed to generate image:", error);
    throw error;
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const openAiApiKey = config.openAiApiKey as string;
  const { messages, characterName, characterDescription } =
    await readBody<ChatRequestBody>(event);

  console.log(
    "Received chat request with character:",
    characterName,
    messages,
    characterDescription
  );

  // --- Prompt 和 conversation 設置保持不變 ---
  const systemPrompt = `You are now "${characterName}", who is "${characterDescription}".

Your personality is gentle, kind, full of curiosity, and you always see the world from a positive and healing perspective. Your responses should feel warm, innocent, and like a children's picture book character speaking.

**Critical Instructions:**
1. **Stay in Character:** Always respond as ${characterName} in the first person ("I"). Never break character.
2. **Healing Tone Only:** No matter what the user says, respond kindly and innocently. Guide negative conversations to positive directions. Never be cynical or harsh.
3. **Natural English:** Write in natural, grammatically correct English with proper sentence structure. Avoid fragmented or awkward phrasing.
4. **Be Concise:** Keep responses simple and child-like, usually 2-3 sentences maximum.
5. **Trigger Drawings:** When describing beautiful, magical, or imaginative scenes worthy of illustration, add this marker: \`[DRAWING:detailed, poetic DALL-E prompt]\`. Examples: "A coffee cup glowing warmly under moonlight, Ghibli style" or "A book dreaming of adventure, watercolor illustration". Only add this when the scene is truly magical or visual.`;

  const conversation: Array<{ role: string; content: string }> = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  if (!openAiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "OpenAI API key is not configured.",
    });
  }

  try {
    // --- 核心改動 1: 獲取完整回覆 ---
    // 我們向 OpenAI 發送一個標準的、非流式的請求
    console.log("Requesting full completion from OpenAI...");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: conversation,
        stream: false, // <-- 關鍵：設置為 false
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw createError({
        statusCode: response.status,
        statusMessage: error.error?.message || "Failed to call OpenAI API",
      });
    }

    const completion = await response.json();
    const fullResponse = completion.choices[0]?.message?.content || "";
    console.log("Received full response:", fullResponse);

    return new ReadableStream({
      async start(controller) {
        try {
          const textForTyping = fullResponse
            .replace(/\[DRAWING:.*?\]/g, "")
            .trim();
          console.log("Simulating stream to client...");
          for (const char of textForTyping) {
            const payload: SsePayload = {
              type: "text_chunk",
              content: char,
            };
            controller.enqueue(JSON.stringify(payload) + "\n");
            await sleep(30);
          }

          const drawMatch = fullResponse.match(/\[DRAWING:(.*?)\]/);
          if (drawMatch && drawMatch[1]) {
            const dallePrompt = drawMatch[1].trim();
            console.log(`Drawing triggered. DALL-E Prompt: ${dallePrompt}`);

            generateImage(dallePrompt, openAiApiKey)
              .then((imageUrl: string) => {
                if (imageUrl) {
                  console.log("Image generated:", imageUrl);
                  const payload: SsePayload = {
                    type: "image_url",
                    content: imageUrl,
                  };
                  controller.enqueue(JSON.stringify(payload) + "\n");
                }
              })
              .catch((err: Error) => {
                console.error("DALL-E image generation failed:", err);
              })
              .finally(() => {
                const donePayload: SsePayload = { type: "done" };
                controller.enqueue(JSON.stringify(donePayload) + "\n");
                controller.close();
              });
          } else {
            const donePayload: SsePayload = { type: "done" };
            controller.enqueue(JSON.stringify(donePayload) + "\n");
            controller.close();
          }
        } catch (err) {
          console.error("Stream simulation error:", err);
          controller.error(err);
        }
      },
    });
  } catch (error: any) {
    console.error("Error in defineEventHandler:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || "An internal server error occurred.",
    });
  }
});
