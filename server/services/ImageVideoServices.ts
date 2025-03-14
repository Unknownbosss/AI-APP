import axios, { AxiosRequestConfig } from "axios";

interface ImageDetails {
  id: string;
  name: string;
  status: string;
  image_count: number;
  type: string;
  created_at: string;
  enabled: boolean;
  total_frame_cost: number;
  downloads: Array<{ url: string; expires_at: string }>;
  error: string | null;
}

class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.magichour.ai/v1";
  }

  async generateImage(
    imageName: string,
    userPrompt: string
  ): Promise<string | undefined> {
    const url = `${this.baseUrl}/ai-image-generator`;
    const options: AxiosRequestConfig = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      data: {
        name: imageName,
        image_count: 1,
        orientation: "square",
        style: {
          prompt: userPrompt,
        },
      },
    };

    try {
      const response = await axios(url, options);
      return response.data.id; // Return the image ID for further processing
    } catch (error) {
      this.handleError(error);
    }
  }

  async fetchImageDetails(imageId: string): Promise<ImageDetails | undefined> {
    const url = `${this.baseUrl}/image-projects/${imageId}`;
    const options: AxiosRequestConfig = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    };

    try {
      const response = await axios(url, options);
      return response.data; // Return the full details of the image
    } catch (error) {
      this.handleError(error);
    }
  }

  async waitForImageCompletion(
    imageId: string,
    interval: number = 5000,
    maxAttempts: number = 10
  ): Promise<ImageDetails | undefined> {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const details = await this.fetchImageDetails(imageId);
      if (details) {
        console.log("Image Status:", details.status);

        if (details.status === "complete") {
          return details; // Return details if the image is complete
        } else if (details.status === "error") {
          throw new Error("Image generation failed.");
        } else if (details.status === "canceled") {
          throw new Error("Image generation was canceled.");
        }
      }

      // Wait for the specified interval before checking again
      await this.delay(interval);
      attempts++;
    }

    throw new Error(
      "Image generation is still in progress after maximum attempts."
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private handleError(error: any): void {
    if (error.response) {
      console.error("Error Response:", error.response.data);
    } else if (error.request) {
      console.error("Error Request:", error.request);
    } else {
      console.error("Error Message:", error.message);
    }
  }

  async generateVideo(
    videoName: string,
    userPrompt: string
  ): Promise<string | undefined> {
    const url = `${this.baseUrl}/text-to-video`;
    const options: AxiosRequestConfig = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      data: {
        name: videoName,
        end_seconds: 10,
        orientation: "square",
        style: {
          prompt: userPrompt,
        },
      },
    };

    try {
      const response = await axios(url, options);
      return response.data.id; // Return the video ID for further processing
    } catch (error) {
      this.handleError(error);
    }
  }

  async fetchVideoDetails(videoId: string): Promise<any | undefined> {
    const url = `${this.baseUrl}/video-projects/${videoId}`;
    const options: AxiosRequestConfig = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    };

    try {
      const response = await axios(url, options);
      return response.data; // Return the full details of the video
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default AIService;
