import { CodeBlock } from "@/components/code/code-block";
import { CodeGroup } from "@/components/code/code-group";
import { PreviewFrame } from "@/components/preview/preview-frame";

import { getRegistryItem } from "@/lib/catalog/registry";

import AppleFolder from "../../../../registry/ui/apple-folder/code/apple-folder";

export default async function AppleFolderPage() {
  const item = await getRegistryItem("apple-folder");

  const sourceFile = item?.files?.find((file) =>
    file.path.endsWith("/code/apple-folder.tsx"),
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <header className="mb-10">
          <p className="mb-3 text-sm text-muted-foreground">UI / Component</p>

          <h1 className="font-heading text-4xl font-semibold tracking-tight">
            Apple Folder
          </h1>

          <p className="mt-3 max-w-2xl  text-muted-foreground">
            An animated folder component built with SVG and Motion.
          </p>
        </header>

        <div className="space-y-10">
          <section>
            <h2 className="mb-4 font-heading text-xl font-medium">Preview</h2>

            <PreviewFrame>
              <AppleFolder />
            </PreviewFrame>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-xl font-medium">Source</h2>

            <CodeBlock
              code={sourceFile?.content ?? ""}
              language="tsx"
              filename="apple-folder.tsx"
            />
          </section>

          <section>
            <h2 className="mb-4 font-heading text-xl font-medium">
              Code group
            </h2>

            <CodeGroup
              tabs={[
                {
                  label: "Component",
                  filename: "apple-folder.tsx",
                  folder: "apple-folder",
                },
                {
                  label: "Usage",
                  filename: "page.tsx",
                  folder: "apple-folder",
                },
              ]}
            >
              <CodeBlock
                code={sourceFile?.content ?? ""}
                language="tsx"
                filename="apple-folder.tsx"
                showHeader={false}
              />
              <CodeBlock
                code={`import AppleFolder from "@/components/apple-folder";

export default function Example() {
  return <AppleFolder />;
}`}
                language="tsx"
                filename="page.tsx"
                showHeader={false}
              />
            </CodeGroup>
          </section>
        </div>
      </div>
    </main>
  );
}
