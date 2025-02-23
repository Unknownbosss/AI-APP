import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGenerationSchema } from "@shared/schema";

const MOCK_DELAY = 2000; // Simulate API delay

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/generations", async (_req, res) => {
    const generations = await storage.getGenerations();
    res.json(generations);
  });

  app.post("/api/generate", async (req, res) => {
    const result = insertGenerationSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

    const mockResults = {
      text: "This is a sample generated text response that would come from an AI model.",
      image: "https://images.unsplash.com/photo-1576086476234-1103be98f096",
      video: "https://example.com/mock-video.mp4",
      audio: "https://example.com/mock-audio.mp3"
    };

    const generation = await storage.createGeneration({
      ...result.data,
      result: mockResults[result.data.type]
    });

    res.json(generation);
  });

  const httpServer = createServer(app);
  return httpServer;
}
