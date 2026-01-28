import { normalizeUrl, resolveUrl } from "../src/url.js";

describe("normalizeUrl", () => {
  test("removes hash fragments", () => {
    const result = normalizeUrl("https://example.com/path#section");
    expect(result).toBe("https://example.com/path");
  });

  test("normalizes index.html to directory root", () => {
    const result = normalizeUrl("https://example.com/blog/index.html");
    expect(result).toBe("https://example.com/blog");
  });

  test("removes trailing slashes except root", () => { 
    const result = normalizeUrl("https://example.com/blog/");
    expect(result).toBe("https://example.com/blog");
  });

  test("returns null for invalid URLs", () => {
    expect(normalizeUrl("not a url")).toBeNull();
  });
});

describe("resolveUrl", () => {
  const base = "https://example.com/base/index.html";

  test("resolves relative paths", () => {
    const result = resolveUrl(base, "../about");
    expect(result).toBe("https://example.com/about");
  });

  test("passes through absolute URLs", () => {
    const url = "https://other.com/page";
    expect(resolveUrl(base, url)).toBe(url);
  });

  test("returns null for mailto/tel/javascript/hash links", () => {
    expect(resolveUrl(base, "mailto:test@example.com")).toBeNull();
    expect(resolveUrl(base, "tel:+123456")).toBeNull();
    expect(resolveUrl(base, "javascript:void(0)")).toBeNull();
    expect(resolveUrl(base, "#section")).toBeNull();
  });

  test("filters out /cdn-cgi/ paths", () => {
    expect(resolveUrl(base, "/cdn-cgi/l/email-protection")).toBeNull();
  });

  test("returns null for invalid URLs", () => {
    expect(resolveUrl("not a url", "/path")).toBeNull();
  });
}
);


