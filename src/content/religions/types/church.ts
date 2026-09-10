import { reference, z } from "astro:content";
import { makeBaseFields } from "@/shared/content/baseFields";
import type { EntryTypeDef } from "@/shared/content/types";

export const churchType: EntryTypeDef = {
  type: "church",
  label: "Igreja",
  relations: [
    { field: "deityRef", targetTypes: ["god"] },
    { field: "ritualRefs", targetTypes: ["ritual"] },
    { field: "relicRefs", targetTypes: ["relic"] },
  ],
  schema: (image) =>
    z
      .object({
        ...makeBaseFields(image),
        type: z.literal("church"),
        founded: z.string().optional(),
        headquarters: z.string().optional(),
        leader: z.string().optional(),
        deityRef: reference("religions").optional(),
        ritualRefs: z.array(reference("religions")).default([]),
        relicRefs: z.array(reference("religions")).default([]),
      })
      .strict(),
};
