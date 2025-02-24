import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGenerationSchema } from "@shared/schema";
import { generateContent } from "./aiml-client";

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

    try {
      // Generate content using AI API
      const generatedResult = await generateContent(
        result.data.type,
        result.data.prompt
      );

      const generation = await storage.createGeneration({
        ...result.data,
        result: generatedResult,
      });

      res.json(generation);
    } catch (error) {
      console.error("Generation error:", error);
      res.status(500).json({ error: "Failed to generate content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
