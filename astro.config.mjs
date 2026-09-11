import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkWikilink from "./src/plugins/remark-wikilink.ts";

export default defineConfig({
  integrations: [
    mdx({
      remarkPlugins: [remarkWikilink],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "wrap",
          },
        ],
      ],
    }),
    react(),
    tailwind(),
    sitemap(),
  ],

  site: "https://archivum.dev.br",
});
