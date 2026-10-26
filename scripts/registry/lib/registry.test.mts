import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import {
  buildManifest,
  componentName,
  contentHash,
  dateLedger,
  discoverItems,
  type RegistryItem,
  renderBarrel,
  renderManifest,
  resolveDates,
  toTitle,
} from "./registry.mts";

const cwd = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

function fakeItem(name: string, content: string): RegistryItem {
  return {
    name,
    kind: "illustration",
    section: "illustration",
    type: "registry:component",
    title: name,
    description: `${name} illustration`,
    hidden: false,
    shared: false,
    path: `registry/fixel/illustrations/${name}.tsx`,
    target: `@components/illustrations/${name}.tsx`,
    content,
    dependencies: [],
    registryDependencies: [],
  };
}

test("slugs become human titles", () => {
  assert.equal(toTitle("kbd"), "Kbd");
  assert.equal(toTitle("input-otp"), "Input OTP");
  assert.equal(toTitle("checkbox-group"), "Checkbox Group");
});

test("component names match the item exports", () => {
  assert.equal(componentName("kbd"), "KbdIllustration");
  assert.equal(componentName("input-otp"), "InputOtpIllustration");
});

test("discovery carries the install shape shadcn needs", async () => {
  const items = await discoverItems(cwd);

  assert.ok(items.length > 0);
  assert.equal(items[0]?.name, "kit", "kit must lead the manifest");

  for (const item of items) {
    assert.match(item.path, /^registry\/fixel\/illustrations\/[^/]+\.tsx$/);
    assert.equal(
      item.target,
      `@components/illustrations/${item.name}.tsx`,
      `${item.name} needs an explicit target`,
    );
    assert.ok(item.content.length > 0);
  }

  // Metadata files sit beside the items, so they must never become items.
  const names = items.map((item) => item.name);
  assert.equal(new Set(names).size, names.length, "names must be unique");
  assert.equal(names.filter((name) => name !== "kit").length, 56);
  assert.deepEqual(
    names.filter((name) => name !== "kit"),
    [...names.filter((name) => name !== "kit")].sort(),
    "items read alphabetically after the kit",
  );

  const kit = items.find((item) => item.name === "kit");
  assert.deepEqual(kit?.dependencies, ["lucide-react"]);
  assert.equal(kit?.hidden, true);
  assert.equal(kit?.shared, true);
  assert.deepEqual(kit?.registryDependencies, []);
});

test("shared files ride along with the items that import them", async () => {
  const items = await discoverItems(cwd);
  const manifest = buildManifest(items);

  const button = manifest.items.find((item) => item.name === "button");
  assert.equal(button?.files.length, 2);
  assert.match(button?.files[0]?.target ?? "", /kit\.tsx$/);
  assert.match(button?.files[1]?.target ?? "", /button\.tsx$/);
  // The shared kit imports lucide-react, so the item must install it too.
  assert.deepEqual(button?.dependencies, ["lucide-react"]);

  const kit = manifest.items.find((item) => item.name === "kit");
  assert.equal(kit?.files.length, 1, "the kit must not embed itself");

  // A file that never imports the kit must not drag it into the install.
  const spinner = manifest.items.find((item) => item.name === "spinner");
  assert.equal(spinner?.files.length, 1);
  assert.equal(spinner?.dependencies, undefined);

  // `motion/react` is published as `motion`, so the install name must not be
  // derived from the import specifier.
  const animation = manifest.items.find((item) => item.name === "animation");
  assert.deepEqual(animation?.dependencies, ["lucide-react", "motion"]);
  assert.match(animation?.files.at(-1)?.content ?? "", /from "motion\/react"/);

  // Bare registry dependency names resolve against ui.shadcn.com, so none may
  // appear here: an item that needs the kit carries it as a file instead.
  for (const item of manifest.items) {
    assert.equal(item.registryDependencies, undefined, item.name);
  }
});

test("the manifest is valid JSON and hides the kit from the catalog", async () => {
  const items = await discoverItems(cwd);
  const manifest = buildManifest(items);

  assert.deepEqual(JSON.parse(JSON.stringify(manifest)), manifest);
  assert.equal(manifest.items.length, items.length);
  assert.equal(manifest.items[0]?.hidden, true);

  const barrel = renderBarrel(items, "illustration");
  assert.ok(barrel.includes('"button": ButtonIllustration'));
  assert.ok(!barrel.includes("kit"), "the kit is shared code, not a card");
});

test("new items get stable uploaded and updated dates", () => {
  const now = new Date("2026-10-26T09:00:00.000Z");
  const dates = resolveDates(
    [fakeItem("button", "export const Button = 1;")],
    {},
    { now },
  );

  assert.deepEqual(dates.button, {
    contentHash: contentHash([
      {
        path: "registry/fixel/illustrations/button.tsx",
        type: "registry:component",
        target: "@components/illustrations/button.tsx",
        content: "export const Button = 1;",
      },
    ]),
    uploadedAt: now.toISOString(),
    updatedAt: now.toISOString(),
  });
});

test("unchanged item payload keeps both dates", () => {
  const item = fakeItem("button", "export const Button = 1;");
  const previous = resolveDates(
    [item],
    {},
    {
      now: new Date("2026-10-25T09:00:00.000Z"),
    },
  );
  const next = resolveDates([item], previous, {
    now: new Date("2026-10-26T09:00:00.000Z"),
  });

  assert.deepEqual(next, previous);
});

test("changed item payload preserves uploadedAt and advances updatedAt", () => {
  const original = fakeItem("button", "export const Button = 1;");
  const previous = resolveDates(
    [original],
    {},
    {
      now: new Date("2026-10-25T09:00:00.000Z"),
    },
  );
  const next = resolveDates(
    [fakeItem("button", "export const Button = 2;")],
    previous,
    { now: new Date("2026-10-26T09:00:00.000Z") },
  );

  assert.equal(next.button?.uploadedAt, previous.button?.uploadedAt);
  assert.equal(next.button?.updatedAt, "2026-10-26T09:00:00.000Z");
  assert.notEqual(next.button?.contentHash, previous.button?.contentHash);
});

test("manifest date fields round-trip through the date ledger", () => {
  const item = fakeItem("button", "export const Button = 1;");
  const dates = resolveDates(
    [item],
    {},
    {
      now: new Date("2026-10-26T09:00:00.000Z"),
    },
  );
  const manifest = buildManifest([item], dates);
  const rendered = renderManifest([item], dates);

  assert.deepEqual(dateLedger(manifest), dates);
  assert.deepEqual(JSON.parse(rendered), manifest);
  assert.equal(manifest.items[0]?.uploadedAt, dates.button?.uploadedAt);
  assert.equal(manifest.items[0]?.updatedAt, dates.button?.updatedAt);
});
