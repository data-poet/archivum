// Lives here rather than content/meta.ts so baseFields.ts can depend on it without a cycle
// (content/meta.ts pulls in per-collection meta.ts, which pulls in schemas that use baseFields.ts).

export const AUTHORS: Record<string, string> = {
  r4ven: "r4ven",
};
export const AUTHOR_IDS = Object.keys(AUTHORS) as [string, ...string[]];
