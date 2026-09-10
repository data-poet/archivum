import { z } from "astro:content";
import { AUTHOR_IDS } from "@/shared/content/authors";
import { TAGS } from "@/shared/content/tags";

export const IMAGE_TYPES = [
  "art",
  "symbol",
  "map",
  "portrait",
  "artifact",
] as const;

// Optional: Extract the TypeScript union type ("art" | "symbol" | ...)
export type ImageType = (typeof IMAGE_TYPES)[number];

//content-shared/baseFields.ts — Fields common to every entry in every collection.
export function makeBaseFields(image: (...args: any[]) => z.ZodType<any>) {
  return {
    title: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    description: z.string().optional(),
    tags: z.array(z.enum(TAGS)).default([]),
    authors: z.array(z.enum(AUTHOR_IDS)).default([]),
    draft: z.boolean().default(false),
    images: z
      .array(
        z.object({
          src: image(),
          caption: z.string().optional(),
          alt: z.string().optional(),
          // 2. Pass the constant array into z.enum()
          type: z.enum(IMAGE_TYPES).optional(),
          primary: z.boolean().default(false),
        })
      )
      .optional(),
  };
}