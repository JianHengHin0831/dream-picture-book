// server/api/analyze.post.ts

import { defineEventHandler, readBody } from "h3";

interface GptAnalysisResponse {
  story_template: string; // e.g., "在一個被遺忘的角落，一個孤單的 [主角名字] 靜靜地等待著..."
  character_description: string; // e.g., "一個有著溫暖棕色外殼和害羞眼神的咖啡杯"
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const openAiApiKey = config.openAiApiKey;
  if (!openAiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "OpenAI API key is not configured.",
    });
  }

  const { image: base64Image } = await readBody(event);
  if (!base64Image) {
    throw createError({ statusCode: 400, statusMessage: "No image provided." });
  }

  try {
    console.log("Calling GPT-4o for initial analysis...");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `你是一位富有想像力的兒童繪本作家。請看這張圖片裡的東西。
                1. 請將圖片中的主要物品視為主角。
                2. 寫一個不超過50字的、帶有奇幻色彩的童話故事開頭。在這個故事裡，使用 "[主角名字]" 作為主角的佔位符。
                3. 請用一句話描述這個主角的外觀和氣質。
                請返回一個 JSON 物件，格式為：{ "story_template": "你的中文故事，包含佔位符", "character_description": "主角的描述" }。確保返回的是純淨的 JSON。`,
              },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${base64Image}` },
              },
            ],
          },
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API Error:", await response.text());
      throw new Error("Failed to get a valid response from GPT-4o analysis.");
    }

    const data = await response.json();
    const content = JSON.parse(
      data.choices[0].message.content
    ) as GptAnalysisResponse;

    console.log("Analysis successful:", content);
    return content;
  } catch (error: any) {
    console.error("Error in analyze endpoint:", error);
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
