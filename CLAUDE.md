# Comments

Code should be self-explanatory through clear naming and structure. Comments are the exception, not the default.

- Default to no comments.
- Only add a comment when the WHY is non-obvious: a hidden constraint, a workaround for a specific bug, a subtle invariant, or behavior that would surprise a reader.
- Never explain WHAT the code does — good names already do that.
- Never reference the current task, ticket, or fix ("added for X", "fixes #123") — that belongs in the commit message, not the code.
- Keep comments as short as possible — one line, not a paragraph.
- No commented-out code, no restating the function/variable name in prose.

# Architecture

`src/` stays type-first at the top level: `components/`, `pages/`, `content/`, `utils/`, `shared/` (plus `layouts/`, `plugins/`, `styles/`). Astro requires pages under `src/pages/**` and content collection config at `src/content/config.ts`, so a feature never owns its pages/content config outside those locations.

- Each feature gets its own same-named subfolder inside whichever type folders it actually needs (e.g. `pages/maps/`, `components/maps/`) — mirrors the existing `religions`/`races` pattern.
- Something belongs in flat `utils/` or `shared/` only if two or more features actually use it. One consumer means it belongs in that feature's own subfolder instead.
- Don't scaffold a feature's folders before the feature is actually being built.

# Responsive design

- Mobile-first Tailwind: unprefixed classes target the smallest screens; breakpoint prefixes (`sm:`/`md:`/`lg:`/`xl:`) layer on enhancements for wider viewports, never the reverse.
- Multi-column layouts collapse progressively at named breakpoints rather than squeezing columns — see `WikiLayout.astro` (TOC sidebar hidden below `xl`, infobox sidebar hidden below `lg`) as the reference implementation.
- List rows (title + badges + meta) wrap (`flex-wrap`) rather than truncating or overflowing horizontally on narrow screens.

# Commits

- Never add a `Co-Authored-By` trailer or any other AI-attribution line — commits are authored by the user alone.
- Commit messages are one-liners, no body and always not signed.
