// Controlled tag vocabulary — mirrors authors.ts. Prevents near-duplicate
// tags (e.g. "primeiro-mundo" vs "primeira-mundo") from silently splitting
// what should be one tag across articles.
// To add a tag: add it here.

export const TAGS = [
  "dragoes",
  "primeiro-mundo",
  "guerras-draconicas",
  "kobolds",
  "draconatos",
  "panteao",
] as const;

export type Tag = (typeof TAGS)[number];
