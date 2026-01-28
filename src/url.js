import { URL } from "url";

export function normalizeUrl(rawUrl) {
  try {
    const u = new URL(rawUrl);
    u.hash = "";

    if (u.pathname.endsWith("/index.html")) {
      u.pathname = u.pathname.replace(/\/index\.html$/, "/");
    }
    if (u.pathname.length > 1 && u.pathname.endsWith("/")) {
      u.pathname = u.pathname.slice(0, -1);
    }

    return u.toString();
  } catch {
    return null;
  }
}

export function resolveUrl(base, href) {
  if (!href || /^(mailto:|tel:|javascript:|#)/i.test(href)) return null; 

  if (href.includes("/cdn-cgi/")) return null;

  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

export function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}
