import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { normalizeResourceUrl, resourceHost } from "../../lib/url.ts";

describe("normalizeResourceUrl", () => {
  it("keeps a bare origin stable", () => {
    assert.equal(
      normalizeResourceUrl("https://example.com"),
      "https://example.com/",
    );
    assert.equal(
      normalizeResourceUrl("https://example.com/"),
      "https://example.com/",
    );
  });

  it("drops the www prefix and lowercase the host", () => {
    assert.equal(
      normalizeResourceUrl("https://WWW.Example.COM/docs/"),
      "https://example.com/docs",
    );
  });

  it("strips a trailing slash and the hash, keeps the query", () => {
    assert.equal(
      normalizeResourceUrl("https://example.com/docs/?ref=nav#install"),
      "https://example.com/docs?ref=nav",
    );
  });

  it("preserves path case", () => {
    assert.equal(
      normalizeResourceUrl("https://example.com/Docs"),
      "https://example.com/Docs",
    );
  });

  it("drops default ports but keeps custom ones", () => {
    assert.equal(
      normalizeResourceUrl("https://example.com:443/"),
      "https://example.com/",
    );
    assert.equal(
      normalizeResourceUrl("http://example.com:8080/"),
      "http://example.com:8080/",
    );
  });

  it("rejects anything that is not http(s)", () => {
    assert.equal(normalizeResourceUrl("ftp://example.com"), null);
    assert.equal(normalizeResourceUrl("javascript:alert(1)"), null);
    assert.equal(normalizeResourceUrl("example.com"), null);
    assert.equal(normalizeResourceUrl("   "), null);
  });
});

describe("resourceHost", () => {
  it("returns the bare hostname", () => {
    assert.equal(resourceHost("https://www.example.com/docs"), "example.com");
  });

  it("falls back to the input when unparseable", () => {
    assert.equal(resourceHost("nonsense"), "nonsense");
  });
});
