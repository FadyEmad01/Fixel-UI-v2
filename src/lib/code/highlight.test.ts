import { describe, expect, it } from "vitest";

import { highlightCode } from "./highlight";

describe("highlightCode", () => {
  it("renders line numbers and Shiki code annotations", async () => {
    const html = await highlightCode(
      "const value = 1; // [!code ++]\nreturn value; // [!code focus]",
      "tsx",
      { lineNumbers: true },
    );

    expect(html).toContain('class="line diff add"');
    expect(html).toContain('class="line focused"');
    expect(html).toContain('class="line-number"');
  });
});
