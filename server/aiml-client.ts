import { useText, useAudio, useImage, useVideo } from "./hooks/hooks";

export async function generateContent(
  type: string,
  prompt: string
): Promise<string> {
  // Return the appropriate field based on content type
  switch (type) {
    case "text":
      return useText(prompt);
    case "image":
      const imageUrl = await useImage(prompt);
      if (!imageUrl) {
        throw new Error("Image generation failed or returned no URL.");
      }
      return imageUrl;
    case "audio":
      return useAudio(prompt);
    case "video":
      return useVideo(prompt);
    default:
      throw new Error(`Unsupported content type: ${type}`);
  }
}
