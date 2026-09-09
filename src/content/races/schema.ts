import { defineCollection, reference, z } from "astro:content";
import { makeBaseFields } from "@/shared/content/baseFields";

/**
 * Races collection schema.
 * Uses a discriminated union (`race` vs `sub-race`) with shared `raceCommonFields`.
 * `sub-race` entries require a `parentRace` reference to their base race.
 */

export const races = defineCollection({
  type: "content",
  schema: ({ image }) => {
    const baseFields = makeBaseFields(image);

    const raceCommonFields = {
      vision: z.string().optional(),
      languages: z.array(z.string()).default([]),
      physicalMaturity: z.string().optional(),
      mentalMaturity: z.string().optional(),
      lifeExpectancy: z.string().optional(),
      averageHeight: z.string().optional(),
      averageWeight: z.string().optional(),
      skinColors: z.string().optional(),
      eyeColors: z.string().optional(),
      distinctions: z.string().optional(),
    };

    const raceSchema = z
      .object({
        ...baseFields,
        type: z.literal("race"),
        ...raceCommonFields,
      })
      .strict();

    const subRaceSchema = z
      .object({
        ...baseFields,
        type: z.literal("sub-race"),
        ...raceCommonFields,
        parentRace: reference("races"), // → race
        homeland: z.string().optional(),
        regionOfOrigin: z.string().optional(),
        innateAdvantages: z.array(z.string()).default([]),
        innateDisadvantages: z.array(z.string()).default([]),
      })
      .strict();

    return z.discriminatedUnion("type", [raceSchema, subRaceSchema]);
  },
});