import { describe, expect, it } from "vitest";
import { getCatalogItem } from "./index";

describe("catalog adapter", () => {
  it("normalizes apple-folder from registry and documentation", async () => {
    await expect(getCatalogItem("apple-folder")).resolves.toEqual({
      id: "apple-folder",
      title: "Apple Folder",
      description: "An animated Apple-style folder component.",
      kind: "component",
      registryType: "registry:component",
      tags: ["motion", "svg", "interactive"],
      preview: {
        renderer: "video",
        src: "/r/apple-folder/preview/apple-folder.mp4",
      },
      sections: [
        { type: "preview" },
        { type: "installation" },
        { type: "dependencies" },
        { type: "source" },
      ],
      dependencies: ["motion"],
      registryDependencies: [],
      status: "draft",
    });
  });
});
