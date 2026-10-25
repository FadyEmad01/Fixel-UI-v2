"use client";

import {
  Bot,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  FileText,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Assistant } from "../lib/install";

const ASSISTANT_ICONS = {
  chatgpt: Sparkles,
  claude: Bot,
  scira: Search,
} as const;

/**
 * Page-level actions: copy the markdown, open it raw, or hand the install to
 * an assistant or v0.
 *
 * The markdown is produced on the server once and passed in, so "Copy page"
 * never has to fetch the `/md` route.
 */
export function PageActions({
  markdown,
  markdownHref,
  v0,
  assistants,
}: {
  markdown: string;
  markdownHref: string;
  v0: string;
  assistants: Assistant[];
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  async function copyPage() {
    try {
      await navigator.clipboard.writeText(markdown);
    } catch {
      return;
    }

    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex shrink-0 items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={copyPage}
        className="gap-1.5 rounded-r-none border-r-0"
      >
        {copied ? (
          <Check className="size-3.5 text-green-600" aria-hidden="true" />
        ) : (
          <Copy className="size-3.5" aria-hidden="true" />
        )}
        {copied ? "Copied" : "Copy page"}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="More page actions"
            className="rounded-l-none"
          >
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem asChild>
            <Link href={markdownHref}>
              <FileText aria-hidden="true" />
              View as Markdown
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <a href={v0} target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden="true" />
              Open in v0
            </a>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Open in</DropdownMenuLabel>

          {assistants.map((assistant) => {
            const Icon =
              ASSISTANT_ICONS[assistant.id as keyof typeof ASSISTANT_ICONS] ??
              ExternalLink;

            return (
              <DropdownMenuItem key={assistant.id} asChild>
                <a href={assistant.href} target="_blank" rel="noreferrer">
                  <Icon aria-hidden="true" />
                  {assistant.label}
                </a>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
