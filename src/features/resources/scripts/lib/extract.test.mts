import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  absoluteAssetUrl,
  cleanText,
  deriveName,
  extractMetadata,
} from "./extract.mts";

const RICH_HTML = `<!doctype html>
<html>
  <head>
    <title>Acme Components — Build faster</title>
    <meta property="og:title" content="Acme Components" />
    <meta property="og:description" content="  A  component
      library for busy people.  " />
    <meta property="og:image" content="/social/card.png" />
    <meta property="og:site_name" content="Acme" />
    <meta name="theme-color" content="#0f172a" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/touch.png" />
  </head>
  <body></body>
</html>`;

const MINIMAL_HTML = `<!doctype html>
<html>
  <head>
    <title>Plain Site | The plainest</title>
    <meta name="description" content="Nothing fancy." />
  </head>
</html>`;

describe("extractMetadata", () => {
  it("reads Open Graph tags and resolves relative assets", () => {
    const meta = extractMetadata(RICH_HTML, "https://acme.dev/docs");

    assert.equal(meta.name, "Acme");
    assert.equal(meta.title, "Acme Components");
    assert.equal(meta.description, "A component library for busy people.");
    assert.equal(meta.image, "https://acme.dev/social/card.png");
    assert.equal(meta.icon, "https://acme.dev/touch.png");
    assert.equal(meta.siteName, "Acme");
    assert.equal(meta.themeColor, "#0f172a");
  });

  it("falls back to the title and description tags", () => {
    const meta = extractMetadata(MINIMAL_HTML, "https://plain.example");

    assert.equal(meta.name, "Plain Site");
    assert.equal(meta.description, "Nothing fancy.");
    assert.equal(meta.image, null);
    assert.equal(meta.icon, null);
  });

  it("uses the hostname when the page has no title", () => {
    const meta = extractMetadata(
      "<html><head></head></html>",
      "https://www.quiet.site/",
    );
    assert.equal(meta.name, "quiet.site");
  });

  it("rejects inline and scriptable image URLs", () => {
    const html = `<head><meta property="og:image" content="data:image/png;base64,AAAA" /></head>`;
    assert.equal(extractMetadata(html, "https://acme.dev").image, null);

    const script = `<head><meta property="og:image" content="javascript:alert(1)" /></head>`;
    assert.equal(extractMetadata(script, "https://acme.dev").image, null);
  });
});

describe("deriveName", () => {
  it("prefers the site name over the page headline", () => {
    assert.equal(deriveName("Acme — Build faster", "Acme", "acme.dev"), "Acme");
  });

  it("splits a tagline off the title", () => {
    assert.equal(deriveName("Acme · Components", null, "acme.dev"), "Acme");
    assert.equal(deriveName("Acme - Components", null, "acme.dev"), "Acme");
    assert.equal(deriveName("Acme | Components", null, "acme.dev"), "Acme");
  });

  it("does not split hyphens inside a word", () => {
    assert.equal(deriveName("shadcn/ui", null, "ui.shadcn.com"), "shadcn/ui");
    assert.equal(
      deriveName("Tailwind CSS", null, "tailwindcss.com"),
      "Tailwind CSS",
    );
  });

  it("falls back to the hostname", () => {
    assert.equal(deriveName(null, null, "acme.dev"), "acme.dev");
  });
});

describe("absoluteAssetUrl", () => {
  it("resolves relative paths against the page", () => {
    assert.equal(
      absoluteAssetUrl("../img.png", "https://acme.dev/docs/page"),
      "https://acme.dev/img.png",
    );
  });

  it("returns null for empty or unsupported values", () => {
    assert.equal(absoluteAssetUrl("", "https://acme.dev"), null);
    assert.equal(absoluteAssetUrl(null, "https://acme.dev"), null);
    assert.equal(
      absoluteAssetUrl("data:text/html,hi", "https://acme.dev"),
      null,
    );
  });
});

describe("cleanText", () => {
  it("collapses whitespace and caps length", () => {
    assert.equal(cleanText("  a \n b ", 10), "a b");
    assert.equal(cleanText("abcdef", 3), "abc");
    assert.equal(cleanText("   ", 10), null);
  });
});
