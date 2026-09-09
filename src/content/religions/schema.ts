import { defineCollection, reference, z } from "astro:content";
import { makeBaseFields } from "@/shared/content/baseFields";

/**
 * Religions collection schema.
 * Uses a discriminated union on `type` with `.strict()` schemas.
 * References store content slugs without collection prefixes (e.g., "draconic-faith/gods/bahamut").
 * To add a type: declare schema below, add to `discriminatedUnion`, update `RELIGIONS_TYPE_LABELS`, and wire UI component.
 */

export const religions = defineCollection({
  type: "content",
  schema: ({ image }) => {
    const baseFields = makeBaseFields(image);

    const pantheonSchema = z
      .object({
        ...baseFields,
        type: z.literal("pantheon"),
        pantheonDeities: z.array(reference("religions")).default([]), // → god[]
        pantheonMyth: reference("religions").optional(), // → creation-myth
      })
      .strict();

    const godSchema = z
      .object({
        ...baseFields,
        type: z.literal("god"),
        domains: z.array(z.string()).default([]),
        symbol: z.string().optional(),
        worshipers: z.string().optional(),
        realm: z.string().optional(),
        alterEgos: z.array(z.string()).default([]),
        pantheon: reference("religions").optional(), // → pantheon
        worshipedBy: z.array(reference("religions")).default([]), // → church[]
        honoredBy: z.array(reference("religions")).default([]), // → ritual[]
        createdRelics: z.array(reference("religions")).default([]), // → relic[]
        avatars: z.array(reference("religions")).default([]), // → god[]
      })
      .strict();

    const churchSchema = z
      .object({
        ...baseFields,
        type: z.literal("church"),
        founded: z.string().optional(),
        headquarters: z.string().optional(),
        leader: z.string().optional(),
        deity: reference("religions").optional(), // → god
        performs: z.array(reference("religions")).default([]), // → ritual[]
        guards: z.array(reference("religions")).default([]), // → relic[]
      })
      .strict();

    const orderSchema = z
      .object({
        ...baseFields,
        type: z.literal("order"),
        founded: z.string().optional(),
        headquarters: z.string().optional(),
        leader: z.string().optional(),
        orderDeity: reference("religions").optional(), // → god
        parentChurch: reference("religions").optional(), // → church
        relatedReligions: z.array(reference("religions")).default([]), // → pantheon[]
        orderPerforms: z.array(reference("religions")).default([]), // → ritual[]
        orderGuards: z.array(reference("religions")).default([]), // → relic[]
      })
      .strict();

    const relicSchema = z
      .object({
        ...baseFields,
        type: z.literal("relic"),
        relicType: z.string().optional(),
        origin: z.string().optional(),
        powers: z.array(z.string()).default([]),
        createdBy: reference("religions").optional(), // → god
        heldBy: reference("religions").optional(), // → church
      })
      .strict();

    const ritualSchema = z
      .object({
        ...baseFields,
        type: z.literal("ritual"),
        participants: z.string().optional(),
        frequency: z.string().optional(),
        purpose: z.string().optional(),
        conductedBy: reference("religions").optional(), // → church
        honoredGod: reference("religions").optional(), // → god
      })
      .strict();

    const creationMythSchema = z
      .object({
        ...baseFields,
        type: z.literal("creation-myth"),
        pantheonRef: reference("religions").optional(), // → pantheon
      })
      .strict();

    return z.discriminatedUnion("type", [
      pantheonSchema,
      godSchema,
      churchSchema,
      orderSchema,
      relicSchema,
      ritualSchema,
      creationMythSchema,
    ]);
  },
});