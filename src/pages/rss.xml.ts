/**
 * rss.xml.ts — Site-wide RSS feed of every published article.
 *
 * Same collection-agnostic scanning pattern as search-index.json.ts, so a
 * new collection shows up in the feed automatically without editing this file.
 */

import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';
import { collections as collectionConfig } from '../content/config';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/shared/siteMeta';

type AnyEntry = CollectionEntry<CollectionKey>;

export async function GET(context: APIContext) {
  const collectionKeys = Object.keys(collectionConfig);
  const lists = await Promise.all(
    collectionKeys.map((col) => getCollection(col as any, ({ data }: any) => !data.draft))
  );
  const entries = lists.flat() as AnyEntry[];

  const items = entries
    .map((entry) => {
      const data = entry.data as any;
      return {
        title: data.title ?? entry.slug,
        description: data.description ?? '',
        pubDate: data.publishedAt,
        link: `/${entry.collection}/${entry.slug}`,
      };
    })
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items,
  });
}
