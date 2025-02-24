import { OpenAI } from "openai";

async function useText(prompt: string): Promise<string> {
  const baseURL = "https://api.aimlapi.com/v1";
  const apiKey = import.meta.env.VITE_AIML_API_KEY;

  const api = new OpenAI({
    apiKey,
    baseURL,
  });

  try {
    const response = await api.chat.completions.create({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        {
          role: "system",
          content: "You are an AI that replies using Nigerian Pidgin",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 256,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content");
  }
}
function useAudio(prompt: string) {}
function useImage(prompt: string) {}
function useVideo(prompt: string) {}

export { useText, useAudio, useImage, useVideo };
