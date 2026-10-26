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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
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
      <div className="hidden items-center md:flex">
        <Button
          variant="secondary"
          size="sm"
          onClick={copyPage}
          className="h-8 gap-1.5 rounded-r-none md:h-7"
        >
          {copied ? (
            <Check className="size-3.5 text-green-600" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5" aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy Page"}
        </Button>
        <Separator orientation="vertical" className="z-10 -mx-px h-4" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon-sm"
              aria-label="More page actions"
              className="h-8 rounded-l-none md:h-7"
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

      <div className="flex items-center md:hidden">
        <Button
          variant="secondary"
          size="sm"
          onClick={copyPage}
          className="h-8 gap-1.5 rounded-r-none"
        >
          {copied ? (
            <Check className="size-3.5 text-green-600" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5" aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy Page"}
        </Button>
        <Separator orientation="vertical" className="z-10 -mx-px h-4" />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              size="icon-sm"
              aria-label="More page actions"
              className="h-8 rounded-l-none"
            >
              <ChevronDown className="size-3.5" aria-hidden="true" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56 gap-1">
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href={markdownHref}>
                <FileText aria-hidden="true" />
                View as Markdown
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <a href={v0} target="_blank" rel="noreferrer">
                <ExternalLink aria-hidden="true" />
                Open in v0
              </a>
            </Button>
            <Separator className="my-1" />
            <p className="px-2 py-1 font-archivo text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              Open in
            </p>
            {assistants.map((assistant) => {
              const Icon =
                ASSISTANT_ICONS[assistant.id as keyof typeof ASSISTANT_ICONS] ??
                ExternalLink;

              return (
                <Button
                  key={assistant.id}
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <a href={assistant.href} target="_blank" rel="noreferrer">
                    <Icon aria-hidden="true" />
                    {assistant.label}
                  </a>
                </Button>
              );
            })}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
