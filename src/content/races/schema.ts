import { defineCollection, z } from "astro:content";
import { raceType, subRaceType } from "./types";

/**
 * Races collection schema.
 * Uses a discriminated union (`race` vs `sub-race`) with shared `raceCommonFields`.
 * `sub-race` entries require a `parentRaceRef` reference to their base race.
 * To add a type: create a new file under `types/`, add it to the union below and to `types/index.ts`'s `RACES_TYPES`.
 */
export const races = defineCollection({
  type: "content",
  schema: ({ image }) => z.discriminatedUnion("type", [raceType.schema(image), subRaceType.schema(image)]),
});
