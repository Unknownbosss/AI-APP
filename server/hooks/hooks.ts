import AIService from "../services/ImageVideoServices";
import ChatAPI from "../services/TextAudioService";
import dotenv from "dotenv";
dotenv.config();

const magicHourApiKey = process.env.VITE_MAGICHOUR_API_KEY || "";
const openAIApiKey = process.env.VITE_OPENAI_API_KEY || "";

if (!magicHourApiKey || !openAIApiKey) {
  throw new Error("API keys must be set in the environment variables.");
}

const aiService = new AIService(magicHourApiKey);
const chatAPI = new ChatAPI(openAIApiKey);

async function useText(prompt: string): Promise<string> {
  return await chatAPI.generateText(prompt);
}

async function useAudio(prompt: string) {
  return await chatAPI.generateText(prompt);
}

async function useImage(prompt: string) {
  const imageName = prompt.substring(0, 14);
  const userPrompt = prompt;

  const imageId = await aiService.generateImage(imageName, userPrompt);
  if (imageId) {
    try {
      const imageDetails = await aiService.waitForImageCompletion(imageId);
      if (imageDetails && imageDetails.downloads) {
        const imageUrl = imageDetails.downloads[0].url; // Get the URL of the generated image
        return imageUrl;
      }
    } catch (error: any) {
      console.error("Error during image processing:", error.message);
    }
  }
}

async function useVideo(prompt: string) {
  const videoName = prompt.substring(0, 20); // Extract a name for the video
  const userPrompt = prompt;

  const videoId = await aiService.generateVideo(videoName, userPrompt);
  if (videoId) {
    try {
      const videoDetails = await aiService.fetchVideoDetails(videoId);
      if (videoDetails && videoDetails.download) {
        const videoUrl = videoDetails.download.url; // Get the URL of the generated video
        return videoUrl;
      }
    } catch (error: any) {
      console.error("Error during video processing:", error.message);
    }
  }
}

export { useText, useAudio, useImage, useVideo };
