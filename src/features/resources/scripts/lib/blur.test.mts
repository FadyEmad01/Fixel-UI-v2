import assert from "node:assert/strict";
import { describe, it } from "node:test";

import sharp from "sharp";

import { blurDataUrl } from "./blur.mts";

const PNG = await sharp({
  create: { width: 96, height: 64, channels: 3, background: "#2f6fde" },
})
  .png()
  .toBuffer();

describe("blurDataUrl", () => {
  it("turns an image into a small PNG data URL", async () => {
    const value = await blurDataUrl(PNG);

    assert.match(value, /^data:image\/png;base64,/);
    // The snapshot is committed, so a blur has to stay in the kilobyte range.
    assert.ok(value.length < 4000, `blur was ${value.length} chars`);
  });

  it("rejects bytes that are not an image", async () => {
    await assert.rejects(() => blurDataUrl(Buffer.from("not an image")));
  });
});
