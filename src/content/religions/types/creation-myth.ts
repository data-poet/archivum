import { reference, z } from "astro:content";
import { makeBaseFields } from "@/shared/content/baseFields";
import type { EntryTypeDef } from "@/shared/content/types";

export const creationMythType: EntryTypeDef = {
  type: "creation-myth",
  label: "Mito da Criação",
  relations: [{ field: "pantheonRef", targetTypes: ["pantheon"] }],
  schema: (image) =>
    z
      .object({
        ...makeBaseFields(image),
        type: z.literal("creation-myth"),
        pantheonRef: reference("religions").optional(),
      })
      .strict(),
};
