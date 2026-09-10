import { reference, z } from "astro:content";
import { makeBaseFields } from "@/shared/content/baseFields";
import type { EntryTypeDef } from "@/shared/content/types";

export const ritualType: EntryTypeDef = {
  type: "ritual",
  label: "Ritual",
  relations: [
    { field: "churchRef", targetTypes: ["church"] },
    { field: "godRef", targetTypes: ["god"] },
  ],
  schema: (image) =>
    z
      .object({
        ...makeBaseFields(image),
        type: z.literal("ritual"),
        participants: z.string().optional(),
        frequency: z.string().optional(),
        purpose: z.string().optional(),
        churchRef: reference("religions").optional(),
        godRef: reference("religions").optional(),
      })
      .strict(),
};
