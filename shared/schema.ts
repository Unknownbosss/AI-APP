import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const generations = pgTable("generations", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'text' | 'image' | 'video' | 'audio'
  prompt: text("prompt").notNull(),
  result: text("result").notNull(),
  metadata: jsonb("metadata").notNull().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGenerationSchema = createInsertSchema(generations).extend({
  type: z.enum(['text', 'image', 'video', 'audio']),
}).omit({ id: true, createdAt: true });

export type InsertGeneration = z.infer<typeof insertGenerationSchema>;
export type Generation = typeof generations.$inferSelect;
