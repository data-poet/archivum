import { reference, z } from "astro:content";
import { makeBaseFields } from "@/shared/content/baseFields";
import type { EntryTypeDef } from "@/shared/content/types";

export const orderType: EntryTypeDef = {
  type: "order",
  label: "Ordem",
  relations: [
    { field: "deityRef", targetTypes: ["god"] },
    { field: "churchRef", targetTypes: ["church"] },
    { field: "pantheonRefs", targetTypes: ["pantheon"] },
    { field: "ritualRefs", targetTypes: ["ritual"] },
    { field: "relicRefs", targetTypes: ["relic"] },
  ],
  schema: (image) =>
    z
      .object({
        ...makeBaseFields(image),
        type: z.literal("order"),
        founded: z.string().optional(),
        headquarters: z.string().optional(),
        leader: z.string().optional(),
        deityRef: reference("religions").optional(),
        churchRef: reference("religions").optional(),
        pantheonRefs: z.array(reference("religions")).default([]),
        ritualRefs: z.array(reference("religions")).default([]),
        relicRefs: z.array(reference("religions")).default([]),
      })
      .strict(),
};
