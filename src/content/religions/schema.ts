import { defineCollection, z } from "astro:content";
import { pantheonType, godType, churchType, orderType, relicType, ritualType, creationMythType } from "./types";

/**
 * Religions collection schema.
 * Uses a discriminated union on `type` with `.strict()` schemas.
 * References store content slugs without collection prefixes (e.g., "draconic-faith/gods/bahamut").
 * To add a type: create a new file under `types/`, add it to the union below and to `types/index.ts`'s `RELIGIONS_TYPES`.
 */
export const religions = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.discriminatedUnion("type", [
      pantheonType.schema(image),
      godType.schema(image),
      churchType.schema(image),
      orderType.schema(image),
      relicType.schema(image),
      ritualType.schema(image),
      creationMythType.schema(image),
    ]),
});
