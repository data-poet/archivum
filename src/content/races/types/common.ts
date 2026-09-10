import { z } from "astro:content";

/** Fields shared by `race` and `sub-race`. */
export const raceCommonFields = {
  vision: z.string().optional(),
  languages: z.array(z.string()).default([]),
  physicalMaturity: z.string().optional(),
  mentalMaturity: z.string().optional(),
  lifeExpectancy: z.string().optional(),
  averageHeight: z.string().optional(),
  averageWeight: z.string().optional(),
  skinColors: z.string().optional(),
  eyeColors: z.string().optional(),
  distinctions: z.string().optional(),
};
