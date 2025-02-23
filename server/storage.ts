import { generations, type Generation, type InsertGeneration } from "@shared/schema";

export interface IStorage {
  createGeneration(generation: InsertGeneration): Promise<Generation>;
  getGenerations(): Promise<Generation[]>;
}

export class MemStorage implements IStorage {
  private generations: Map<number, Generation>;
  private currentId: number;

  constructor() {
    this.generations = new Map();
    this.currentId = 1;
  }

  async createGeneration(insertGeneration: InsertGeneration): Promise<Generation> {
    const id = this.currentId++;
    const generation: Generation = {
      ...insertGeneration,
      id,
      createdAt: new Date(),
      metadata: {},
    };
    this.generations.set(id, generation);
    return generation;
  }

  async getGenerations(): Promise<Generation[]> {
    return Array.from(this.generations.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();
