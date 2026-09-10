import { reference, z } from "astro:content";
import { makeBaseFields } from "@/shared/content/baseFields";
import type { EntryTypeDef } from "@/shared/content/types";

export const pantheonType: EntryTypeDef = {
  type: "pantheon",
  label: "Panteão",
  relations: [
    { field: "deityRefs", targetTypes: ["god"] },
    { field: "mythRef", targetTypes: ["creation-myth"] },
  ],
  schema: (image) =>
    z
      .object({
        ...makeBaseFields(image),
        type: z.literal("pantheon"),
        deityRefs: z.array(reference("religions")).default([]),
        mythRef: reference("religions").optional(),
      })
      .strict(),
};
