import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  codeSnippets: defineTable({
    userId: v.string(),
    title: v.string(),
    language: v.string(),
    content: v.string(),
    analysis: v.optional(v.string()),
    refinedCode: v.optional(v.string()),
    createdAt: v.number(),
  }),
  notifications: defineTable({
    userId: v.string(),
    content: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
  }),
});