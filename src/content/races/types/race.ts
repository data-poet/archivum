import { z } from "astro:content";
import { makeBaseFields } from "@/shared/content/baseFields";
import type { EntryTypeDef } from "@/shared/content/types";
import { raceCommonFields } from "./common";

export const raceType: EntryTypeDef = {
  type: "race",
  label: "Raça",
  schema: (image) =>
    z
      .object({
        ...makeBaseFields(image),
        type: z.literal("race"),
        ...raceCommonFields,
      })
      .strict(),
};
