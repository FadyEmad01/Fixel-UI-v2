import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { docs } from "../../../.velite";
import { mdxComponents } from "./components";
import { MDXContent } from "./mdx-content";

describe("MDXContent", () => {
  it("renders the compiled apple-folder document", () => {
    const doc = docs.find((item) => item.id === "apple-folder");

    if (!doc) {
      throw new Error("apple-folder document was not generated");
    }

    const markup = renderToStaticMarkup(
      <MDXContent code={doc.content} components={mdxComponents} />,
    );

    expect(markup).toContain("Apple Folder");
    expect(markup).toContain(
      "An animated folder component built with SVG and Motion.",
    );
    expect(markup).toContain("motion");
  });
});
