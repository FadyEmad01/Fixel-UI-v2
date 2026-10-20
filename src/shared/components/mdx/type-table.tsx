"use client";

import { cn } from "cn";
import { Info } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { isExternalHref } from "./link-utils";

export type TypeNode = {
  description?: ReactNode;
  type: ReactNode;
  typeDescription?: ReactNode;
  typeDescriptionLink?: string;
  default?: ReactNode;
  required?: boolean;
  deprecated?: boolean;
  parameters?: { name: string; description: ReactNode }[];
  returns?: ReactNode;
};

const codeClassName =
  "rounded-md bg-accent px-1.5 py-1 font-mono text-[13px] leading-7 text-foreground box-decoration-clone break-words";

function InfoTip({ name, item }: { name: string; item: TypeNode }) {
  const { description, typeDescription, parameters = [], returns } = item;
  if (!description && !typeDescription && !parameters.length && !returns) {
    return null;
  }

  return (
    <Tooltip delayDuration={150}>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={`About ${name}`}
          className="flex size-5 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Info size={15} strokeWidth={2} aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={8}
        className="max-w-xs leading-relaxed whitespace-normal break-words"
      >
        <div className="flex flex-col gap-1.5">
          {description && <div>{description}</div>}
          {typeDescription && (
            <div>
              <span className="opacity-60">Type: </span>
              {typeDescription}
            </div>
          )}
          {parameters.map((param) => (
            <div key={param.name}>
              <span className="font-medium">{param.name}</span>:{" "}
              {param.description}
            </div>
          ))}
          {returns && (
            <div>
              <span className="opacity-60">Returns: </span>
              {returns}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

function TypeLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  if (isExternalHref(href)) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function TypeTable({
  id,
  type,
  className,
}: {
  id?: string;
  type: Record<string, TypeNode>;
  className?: string;
}) {
  return (
    <TooltipProvider>
      <div
        id={id}
        role="region"
        aria-label="Props table"
        tabIndex={0}
        className={cn(
          "my-6 block w-full min-w-0 max-w-full px-1 py-1 rounded-xl bg-accent",
          "overflow-x-auto overflow-y-hidden overscroll-x-contain",
          "[h3+&]:mt-3 [h4+&]:mt-3",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset",
          className,
        )}
      >
        <table className="w-full min-w-xl border-separate border-spacing-x-0 border-spacing-y-1 text-left text-sm text-muted-foreground [&_tbody_td]:bg-background [&_tbody_td:first-child]:rounded-l-lg [&_tbody_td:last-child]:rounded-r-lg">
          <thead className="text-foreground">
            <tr>
              <th className="w-[30%] px-3 pt-1.5 pb-1 font-medium">Prop</th>
              <th className="w-[35%] px-3 pt-1.5 pb-1 font-medium">Type</th>
              <th className="w-[35%] px-3 pt-1.5 pb-1 font-medium">Default</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(type).map(([name, item]) => (
              <tr key={name} id={id ? `${id}-${name}` : undefined}>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    <code
                      className={cn(
                        "rounded-md bg-primary/10 px-1.5 py-1 font-mono text-[13px] text-primary",
                        item.deprecated && "line-through opacity-60",
                      )}
                    >
                      {name}
                      {!item.required && "?"}
                    </code>
                    <InfoTip name={name} item={item} />
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  {item.typeDescriptionLink ? (
                    <TypeLink
                      href={item.typeDescriptionLink}
                      className={cn(codeClassName, "underline")}
                    >
                      {item.type}
                    </TypeLink>
                  ) : (
                    <code className={codeClassName}>{item.type}</code>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  {item.default !== undefined && item.default !== "" ? (
                    <code className={codeClassName}>{item.default}</code>
                  ) : (
                    <span>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TooltipProvider>
  );
}
