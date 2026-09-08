import { defineCollection, reference, z } from "astro:content";

/**
 * Images: astro:assets migration
 * ────────────────────────────────────────────────────────────────────────
 * Image files live next to the .mdx entry that uses them (not in public/),
 * and frontmatter `images[].src` is a relative path — e.g. "./bahamut.webp"
 * for src/content/religions/draconic-faith/gods/bahamut.mdx +
 * src/content/religions/draconic-faith/gods/bahamut.webp sitting beside it.
 *
 * This is Astro's own documented pattern for content-collection images
 * (https://docs.astro.build/en/guides/images/#images-in-content-collections):
 * `image()` resolves the path relative to the entry file and imports it,
 * which is what makes it eligible for real optimization (resizing, format
 * conversion) via getImage()/<Image> — files under public/ are served
 * as-is and can never be optimized, no matter how they're referenced.
 *
 * Because `image()` is only available inside the `schema: ({ image }) => …`
 * function form (not as a plain object), baseFields/raceCommonFields and
 * every type variant are now built inside that callback for each
 * collection, via the makeBaseFields(image) factory below, rather than
 * declared at module scope.
 */

// ── Shared base fields (factory — needs `image` from the schema callback) ────
function makeBaseFields(image: (...args: any[]) => z.ZodType<any>) {
  return {
    title: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    images: z
      .array(
        z.object({
          src: image(),
          caption: z.string().optional(),
          alt: z.string().optional(),
          type: z.enum(["art", "symbol", "map", "portrait", "artifact"]).optional(),
        })
      )
      .optional(),
  };
}

// ── Relation fields ──────────────────────────────────────────────────────────
// Cross-entry references now use Astro's built-in `reference()` helper
// instead of a hand-rolled { slug, label } object.
//
// Authoring: write just the *target's own slug* (unprefixed by collection —
// the same string that entry's own `slug:` frontmatter uses, e.g.
// "draconic-faith/gods/bahamut", NOT "religions/draconic-faith/gods/bahamut").
//   pantheon: "draconic-faith/pantheon"
//   worshipedBy:
//     - "draconic-faith/churches/igreja-da-chama-palida"
//
// At build time Astro validates that slug actually exists in the target
// collection — a typo now fails the build with a list of valid slugs,
// instead of silently producing a dead link.
//
// There's no `label` field anymore: display text is resolved live from the
// target entry's own `title` at render time (see getArticleData() in
// src/utils/articleData.ts), so a renamed entry can't leave a stale label
// behind anywhere that references it.
//
// Every relation field below already conceptually targets one specific
// collection (e.g. `pantheon` always points at a religions entry, never a
// race), so `reference('religions')` / `reference('races')` per field is a
// direct, lossless swap for the old generic `relation` shape.

// ── Religions ─────────────────────────────────────────────────────────────────
// Single collection covering all religious content.
// Subfolders (gods/, churches/, etc.) are organisational only —
// the `type` field distinguishes entries at runtime.

// Schema shape: a discriminated union on `type`, one variant per religion
// entry type. Each variant is `.strict()`, so a field that belongs to a
// different type (e.g. `conductedBy` — a ritual-only field — showing up on
// a `god` entry) fails validation instead of silently passing through.
// This also gives real type narrowing: inside `{data.type === 'god' && (...)}`
// blocks, `data` is narrowed to exactly the god fields, with autocomplete
// and errors for typos or misplaced fields.
//
// Adding a new religion entry type:
//   1. Add a new `z.object({ ...baseFields, type: z.literal('...'), ... }).strict()`
//      variant below and list it in the discriminatedUnion array.
//   2. Register its label in src/content/meta.ts's TYPE_LABELS.
//   3. Add a matching Infobox component and wire it into
//      src/pages/religions/[...slug].astro.

const religions = defineCollection({
  type: "content",
  schema: ({ image }) => {
    const baseFields = makeBaseFields(image);

    const pantheonSchema = z.object({
      ...baseFields,
      type: z.literal("pantheon"),
      // Relations
      pantheonDeities: z.array(reference("religions")).default([]), // → god[]
      pantheonMyth: reference("religions").optional(), // → creation-myth
    }).strict();

    const godSchema = z.object({
      ...baseFields,
      type: z.literal("god"),
      // Descriptive
      domains: z.array(z.string()).default([]),
      symbol: z.string().optional(),
      worshipers: z.string().optional(),
      realm: z.string().optional(),
      alterEgos: z.array(z.string()).default([]),
      // Relations
      pantheon: reference("religions").optional(), // → pantheon
      worshipedBy: z.array(reference("religions")).default([]), // → church[]
      honoredBy: z.array(reference("religions")).default([]), // → ritual[]
      createdRelics: z.array(reference("religions")).default([]), // → relic[]
      avatars: z.array(reference("religions")).default([]), // → god[] (avatar entries)
    }).strict();

    const churchSchema = z.object({
      ...baseFields,
      type: z.literal("church"),
      // Descriptive
      founded: z.string().optional(),
      headquarters: z.string().optional(),
      leader: z.string().optional(),
      // Relations
      deity: reference("religions").optional(), // → god
      performs: z.array(reference("religions")).default([]), // → ritual[]
      guards: z.array(reference("religions")).default([]), // → relic[]
    }).strict();

    // Martial, secret, or knightly orders tied to a religion.
    // `orderDeity` and `parentChurch` are both optional — orders may answer
    // directly to a god, to a church, to both, or to neither (independent).
    // `relatedReligions` handles multi-faith orders without structural complexity.
    // Fields are prefixed (orderDeity, orderPerforms, orderGuards) rather than
    // reusing Church's field names — kept as-is here to avoid a content/prop
    // rename across every consumer; the discriminated union already prevents
    // these from colliding with Church's fields regardless of naming.
    const orderSchema = z.object({
      ...baseFields,
      type: z.literal("order"),
      // Descriptive
      founded: z.string().optional(),
      headquarters: z.string().optional(),
      leader: z.string().optional(),
      // Relations
      orderDeity: reference("religions").optional(), // → god (optional)
      parentChurch: reference("religions").optional(), // → church (optional)
      relatedReligions: z.array(reference("religions")).default([]), // → pantheon[] (multi-faith)
      orderPerforms: z.array(reference("religions")).default([]), // → ritual[]
      orderGuards: z.array(reference("religions")).default([]), // → relic[]
    }).strict();

    const relicSchema = z.object({
      ...baseFields,
      type: z.literal("relic"),
      // Descriptive
      relicType: z.string().optional(),
      origin: z.string().optional(), // narrative origin (era / event)
      powers: z.array(z.string()).default([]),
      // Relations
      createdBy: reference("religions").optional(), // → god
      heldBy: reference("religions").optional(), // → church (or future: faction / character)
    }).strict();

    const ritualSchema = z.object({
      ...baseFields,
      type: z.literal("ritual"),
      // Descriptive
      participants: z.string().optional(),
      frequency: z.string().optional(),
      purpose: z.string().optional(),
      // Relations
      conductedBy: reference("religions").optional(), // → church
      honoredGod: reference("religions").optional(), // → god
    }).strict();

    const creationMythSchema = z.object({
      ...baseFields,
      type: z.literal("creation-myth"),
      // Relations
      pantheonRef: reference("religions").optional(), // → pantheon
    }).strict();

    return z.discriminatedUnion("type", [
      pantheonSchema,
      godSchema,
      churchSchema,
      orderSchema,
      relicSchema,
      ritualSchema,
      creationMythSchema,
    ]);
  },
});

// ── Races ──────────────────────────────────────────────────────────────────────
// Single collection covering all racial content.
// `type: "race"` entries are the base race; `type: "sub-race"` entries are
// derivations and always carry a `parentRace` relation back to the base.
//
// Same discriminated-union + `.strict()` approach as religions above.
// General/life-cycle/appearance fields are shared by both variants, so
// they're factored into `raceCommonFields` and spread into each rather than
// duplicated by hand.

const races = defineCollection({
  type: "content",
  schema: ({ image }) => {
    const baseFields = makeBaseFields(image);

    const raceCommonFields = {
      // ── General Info ──────────────────────────────────────────────────────
      vision: z.string().optional(),
      languages: z.array(z.string()).default([]),
      // ── Life cycle ────────────────────────────────────────────────────────
      physicalMaturity: z.string().optional(),
      mentalMaturity: z.string().optional(),
      lifeExpectancy: z.string().optional(),
      // ── Appearance ────────────────────────────────────────────────────────
      averageHeight: z.string().optional(),
      averageWeight: z.string().optional(),
      skinColors: z.string().optional(),
      eyeColors: z.string().optional(),
      distinctions: z.string().optional(),
    };

    const raceSchema = z.object({
      ...baseFields,
      type: z.literal("race"),
      ...raceCommonFields,
    }).strict();

    const subRaceSchema = z.object({
      ...baseFields,
      type: z.literal("sub-race"),
      ...raceCommonFields,
      // ── Sub-race only ───────────────────────────────────────────────────────
      // `parentRace` links back to the base race entry — required (not optional)
      // since every sub-race is, by definition, a derivation of a base race.
      // `homeland` and `regionOfOrigin` are narrative strings (may name multiple
      //  places); keep as strings rather than arrays for prose flexibility.
      parentRace: reference("races"), // → race
      homeland: z.string().optional(),
      regionOfOrigin: z.string().optional(),
      innateAdvantages: z.array(z.string()).default([]),
      innateDisadvantages: z.array(z.string()).default([]),
    }).strict();

    return z.discriminatedUnion("type", [raceSchema, subRaceSchema]);
  },
});

export const collections = { religions, races };
