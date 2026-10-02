import { previewRegistry } from "@/registry/preview/registry";

interface PreviewRendererProps {
  name: string;
}

export function PreviewRenderer({ name }: PreviewRendererProps) {
  const Preview = previewRegistry[name as keyof typeof previewRegistry];

  if (!Preview) {
    return (
      <div className="flex min-h-full items-center justify-center text-sm text-muted-foreground">
        Preview not found.
      </div>
    );
  }

  return <Preview />;
}
