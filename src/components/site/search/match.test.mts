import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { groupByKind, matchItems } from "./match.ts";
import type { SearchItem, SearchKind } from "./types.ts";

/** A complete item so tests only spell out the fields they care about. */
function item(
  kind: SearchKind,
  title: string,
  overrides: Partial<SearchItem> = {},
): SearchItem {
  return {
    id: `${kind}:${title.toLowerCase().replace(/\s+/g, "-")}`,
    kind,
    slug: title.toLowerCase().replace(/\s+/g, "-"),
    title,
    description: "",
    label: "",
    keywords: [],
    href: `/${kind}`,
    ...overrides,
  };
}

const resources = [
  item("resources", "21st", { keywords: ["UI Components"] }),
  item("resources", "Motion Primitives", { keywords: ["Animation"] }),
];
const illustrations = [
  item("illustrations", "Button", {
    keywords: ["Display & Feedback", "display-feedback"],
    description: "A wireframe button with a smeared outline.",
  }),
  item("illustrations", "Dialog", { keywords: ["Overlays"] }),
];
const easings = [item("easings", "Swift Out", { label: "Easing" })];

const items = [...resources, ...illustrations, ...easings];

describe("matchItems", () => {
  it("returns the whole scoped catalog in order when the query is empty", () => {
    assert.deepEqual(
      matchItems(items, "   ", "all").map((entry) => entry.id),
      items.map((entry) => entry.id),
    );
    assert.deepEqual(
      matchItems(items, "", "illustrations").map((entry) => entry.title),
      ["Button", "Dialog"],
    );
  });

  it("requires every whitespace-separated term to match", () => {
    assert.deepEqual(
      matchItems(items, "wireframe button", "all").map((entry) => entry.title),
      ["Button"],
    );
    assert.deepEqual(matchItems(items, "button dialog", "all"), []);
  });

  it("matches case-insensitively across title, keywords and description", () => {
    assert.equal(matchItems(items, "SWIFT", "all")[0]?.title, "Swift Out");
    assert.equal(matchItems(items, "overlays", "all")[0]?.title, "Dialog");
    assert.equal(matchItems(items, "smeared", "all")[0]?.title, "Button");
  });

  it("ranks a title prefix above a description mention", () => {
    const ranked = matchItems(
      [
        item("resources", "Boilerplate", {
          description: "The motion button library",
        }),
        item("illustrations", "Button"),
      ],
      "but",
      "all",
    );

    assert.deepEqual(
      ranked.map((entry) => entry.title),
      ["Button", "Boilerplate"],
    );
  });

  it("ranks title prefix above a word prefix above a mid-word match", () => {
    const ranked = matchItems(
      [
        item("illustrations", "Pushbutton"),
        item("resources", "Big Button"),
        item("illustrations", "Buttons"),
      ],
      "button",
      "all",
    );

    assert.deepEqual(
      ranked.map((entry) => entry.title),
      ["Buttons", "Big Button", "Pushbutton"],
    );
  });

  it("returns nothing when a term matches no item", () => {
    assert.deepEqual(matchItems(items, "zzz", "all"), []);
  });
});

describe("groupByKind", () => {
  it("orders groups as resources, illustrations, easings and drops empties", () => {
    const groups = groupByKind([...easings, ...illustrations]);

    assert.deepEqual(
      groups.map((group) => group.kind),
      ["illustrations", "easings"],
    );
    assert.deepEqual(
      groups[0]?.items.map((entry) => entry.title),
      ["Button", "Dialog"],
    );
  });

  it("is stable for scope-filtered lists", () => {
    assert.deepEqual(
      groupByKind(matchItems(items, "", "resources")).map(
        (group) => group.items.length,
      ),
      [2],
    );
  });
});
