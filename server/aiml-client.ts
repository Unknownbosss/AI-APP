import { useText, useAudio, useImage, useVideo } from "./hooks/hooks";

export async function generateContent(
  type: string,
  prompt: string
): Promise<string> {
  // Return the appropriate field based on content type
  switch (type) {
    case "text":
      return useText(prompt);
    // case "image":
    //   return useImage(prompt);
    case "audio":
      return useAudio(prompt);
    // case "video":
    //   return useVideo(prompt)
    default:
      throw new Error(`Unsupported content type: ${type}`);
  }
}
