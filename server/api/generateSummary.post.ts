import { defineEventHandler, readBody } from "h3";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface SummaryRequestBody {
  characterName: string;
  chatMessages: ChatMessage[];
}

interface SummaryResponse {
  storyNarrative: string;
  farewellMessage: string;
}

export default defineEventHandler(async (event): Promise<SummaryResponse> => {
  const config = useRuntimeConfig();
  const openAiApiKey = config.openAiApiKey as string;

  const { characterName, chatMessages } = await readBody<SummaryRequestBody>(
    event
  );

  if (!openAiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "OpenAI API key is not configured.",
    });
  }

  // Filter out empty messages
  const validMessages = chatMessages.filter(
    (msg) => msg.content && msg.content.trim()
  );

  if (validMessages.length === 0) {
    return {
      storyNarrative:
        "A brief moment of connection, though fleeting, was truly magical.",
      farewellMessage:
        "Thank you for spending time with me. You brought light to my world.",
    };
  }

  // Create conversation summary prompt
  const conversationText = validMessages
    .map(
      (msg) => `${msg.role === "user" ? "You" : characterName}: ${msg.content}`
    )
    .join("\n");

  const systemPrompt = `You are a skilled storyteller. Your task is to transform a conversation between a character and a user into a beautiful, heartwarming narrative.

The character "${characterName}" has just met the user and had a conversation. Your job is to:

1. **Create a story narrative**: Write a poetic 2-3 sentence narrative that captures the essence of their meeting and conversation. Make it sound like a fairy tale or picture book story. Use vivid, warm language.

2. **Create a farewell message**: Write a single, touching sentence that "${characterName}" would say to the user as they part ways. It should be warm, sincere, and memorable.

Output your response in this exact JSON format:
{
  "storyNarrative": "Your 2-3 sentence narrative here",
  "farewellMessage": "Your single farewell sentence here"
}

Remember to keep the tone gentle, healing, and warm - like a picture book character saying goodbye to a friend.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Here is the conversation between the user and ${characterName}:\n\n${conversationText}`,
          },
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw createError({
        statusCode: response.status,
        statusMessage: error.error?.message || "Failed to call OpenAI API",
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw createError({
        statusCode: 500,
        statusMessage: "No response from OpenAI",
      });
    }

    // Parse the JSON response
    let jsonString = content;
    if (jsonString.startsWith("```json")) {
      jsonString = jsonString.substring(7, jsonString.length - 3).trim();
    }

    // 解析清理後的 JSON 字串
    const result = JSON.parse(jsonString);

    return {
      storyNarrative: result.storyNarrative,
      farewellMessage: result.farewellMessage,
    };
  } catch (err) {
    console.error("Error generating summary:", err);

    // Fallback responses
    return {
      storyNarrative: `When ${characterName} met you, it was the beginning of something magical. Your conversation was filled with warmth and wonder, creating a memory that would last forever.`,
      farewellMessage: `Thank you for seeing the beauty in me and sharing this special moment together.`,
    };
  }
});
