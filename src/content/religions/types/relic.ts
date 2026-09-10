import { reference, z } from "astro:content";
import { makeBaseFields } from "@/shared/content/baseFields";
import type { EntryTypeDef } from "@/shared/content/types";

export const relicType: EntryTypeDef = {
  type: "relic",
  label: "Relíquia",
  relations: [
    { field: "godRef", targetTypes: ["god"] },
    { field: "churchRef", targetTypes: ["church"] },
  ],
  schema: (image) =>
    z
      .object({
        ...makeBaseFields(image),
        type: z.literal("relic"),
        relicType: z.string().optional(),
        origin: z.string().optional(),
        powers: z.array(z.string()).default([]),
        godRef: reference("religions").optional(),
        churchRef: reference("religions").optional(),
      })
      .strict(),
};
