import * as cheerio from "cheerio";
import { fetchHtml, checkLinkStatus } from "./network.js";
import { normalizeUrl, resolveUrl, getDomain } from "./url.js";

export async function crawlSite(baseUrl, { concurrency = 5 } = {}) {
  const normalizedBase = normalizeUrl(baseUrl);
  const baseDomain = getDomain(normalizedBase);

  const pagesVisited = new Set();
  const externalChecked = new Set();
  const linkResults = [];
  const queue = [normalizedBase];

  async function worker() {
    while (queue.length > 0) {
      const url = queue.shift();

      if (!url || pagesVisited.has(url)) continue;
      pagesVisited.add(url);

      try {
        const html = await fetchHtml(url);
        const { internalLinks, outgoingLinks } = extractLinks(url, html, baseDomain);

        for (const link of internalLinks) {
          const normalized = normalizeUrl(link);
          if (normalized && !pagesVisited.has(normalized) && !queue.includes(normalized)) {
            queue.push(normalized);
          }
        }

        for (const { href, text } of outgoingLinks) {
          if (externalChecked.has(href)) continue;
          externalChecked.add(href);

          const status = await checkLinkStatus(href);

          linkResults.push({ 
            source: url,
            href,
            text,
            status,
            ok: status !== null && status < 400,
          });
        }
      } catch {
        linkResults.push({ source: url, href: url, status: null, ok: false });
      }
    }
  }

  const workers = Array(Math.max(1, concurrency))
    .fill(null)
    .map(() => worker());
  await Promise.all(workers);

  return { pagesVisited, linkResults };
}

function extractLinks(pageUrl, html, baseDomain) {
  const $ = cheerio.load(html);
  const internalLinks = [];
  const outgoingLinks = [];

  $("a[href]").each((_, el) => {
    const rawHref = $(el).attr("href");
    const href = resolveUrl(pageUrl, rawHref);
    if (!href) return;

    const rawText = $(el).text().trim();
    const text = rawText.length > 50 ? `${rawText.slice(0, 47)}...` : rawText;

    outgoingLinks.push({ href, text });

    if (getDomain(href) === baseDomain) {
      internalLinks.push(href);
    }
  });

  return { internalLinks, outgoingLinks };
}
