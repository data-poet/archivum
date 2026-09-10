import { reference, z } from "astro:content";
import { makeBaseFields } from "@/shared/content/baseFields";
import type { EntryTypeDef } from "@/shared/content/types";
import { raceCommonFields } from "./common";

export const subRaceType: EntryTypeDef = {
  type: "sub-race",
  label: "Sub-raça",
  relations: [{ field: "parentRaceRef", targetTypes: ["race"] }],
  schema: (image) =>
    z
      .object({
        ...makeBaseFields(image),
        type: z.literal("sub-race"),
        ...raceCommonFields,
        parentRaceRef: reference("races"),
        homeland: z.string().optional(),
        regionOfOrigin: z.string().optional(),
        innateAdvantages: z.array(z.string()).default([]),
        innateDisadvantages: z.array(z.string()).default([]),
      })
      .strict(),
};
