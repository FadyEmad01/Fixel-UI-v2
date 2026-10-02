"use client";

import { cn } from "cn";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copyToClipboard}
      className={cn(
        "relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground transition-colors",
        className,
      )}
      aria-label="Copy code"
    >
      {hasCopied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
}
