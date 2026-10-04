import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PreviewRenderer } from "@/components/preview/preview-renderer";
import { Button } from "@/components/ui/button";
import { previewRegistry } from "@/registry/preview/registry";

interface PreviewPageProps {
  params: Promise<{
    name: string;
  }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { name } = await params;

  const exists = name in previewRegistry;

  if (!exists) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-semibold">
            Preview not found
          </h1>

          <Button asChild variant="ghost" className="mt-4">
            <Link href="/">
              <ArrowLeft />
              Back
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="flex h-14 items-center border-b border-border px-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft />
            Back
          </Link>
        </Button>

        <div className="ml-auto font-heading text-sm font-medium">{name}</div>
      </header>

      <div className="min-h-[calc(100vh-3.5rem)] p-6">
        <div className="flex min-h-full items-center justify-center rounded-2xl bg-muted p-10">
          <PreviewRenderer name={name} />
        </div>
      </div>
    </main>
  );
}
