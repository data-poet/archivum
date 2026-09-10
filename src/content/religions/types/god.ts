import { reference, z } from "astro:content";
import { makeBaseFields } from "@/shared/content/baseFields";
import type { EntryTypeDef } from "@/shared/content/types";

export const godType: EntryTypeDef = {
  type: "god",
  label: "Deus",
  relations: [
    { field: "pantheonRef", targetTypes: ["pantheon"] },
    { field: "churchRefs", targetTypes: ["church"] },
    { field: "ritualRefs", targetTypes: ["ritual"] },
    { field: "relicRefs", targetTypes: ["relic"] },
    { field: "avatarRefs", targetTypes: ["god"] },
  ],
  schema: (image) =>
    z
      .object({
        ...makeBaseFields(image),
        type: z.literal("god"),
        domains: z.array(z.string()).default([]),
        symbol: z.string().optional(),
        worshipers: z.string().optional(),
        realm: z.string().optional(),
        alterEgos: z.array(z.string()).default([]),
        pantheonRef: reference("religions").optional(),
        churchRefs: z.array(reference("religions")).default([]),
        ritualRefs: z.array(reference("religions")).default([]),
        relicRefs: z.array(reference("religions")).default([]),
        avatarRefs: z.array(reference("religions")).default([]),
      })
      .strict(),
};
