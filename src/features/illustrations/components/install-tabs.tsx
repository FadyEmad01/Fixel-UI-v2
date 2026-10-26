"use client";

import { type ReactNode, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { PACKAGE_MANAGERS, type PackageManager } from "../lib/install";
import { InstallCommand } from "./install-command";

/**
 * Automatic vs manual install, with a package manager picker that applies to
 * both.
 *
 * The commands arrive pre-built for every package manager, so switching tabs or
 * managers never triggers a fetch and the copy button always copies exactly
 * what is on screen. Manual file blocks are rendered on the server and passed
 * through as children.
 */
export function InstallTabs({
  automatic,
  dependencies,
  packages,
  children,
}: {
  automatic: Record<PackageManager, string>;
  dependencies?: Record<PackageManager, string>;
  packages: string[];
  children: ReactNode;
}) {
  const [packageManager, setPackageManager] = useState<PackageManager>("pnpm");

  return (
    <Tabs defaultValue="automatic" className="mt-4 gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <TabsList>
          <TabsTrigger className="shadow-none!" value="automatic">Automatic</TabsTrigger>
          <TabsTrigger className="shadow-none!" value="manual">Manual</TabsTrigger>
        </TabsList>

        <fieldset className="m-0 inline-flex w-fit min-w-0 items-center rounded-lg border-0 bg-muted p-[3px]">
          <legend className="sr-only">Package manager</legend>
          {PACKAGE_MANAGERS.map((manager) => (
            <button
              key={manager}
              type="button"
              onClick={() => setPackageManager(manager)}
              aria-pressed={packageManager === manager}
              className={cn(
                "h-6 rounded-md px-2 font-archivo text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                packageManager === manager
                  ? "bg-background text-foreground shadow-none"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {manager}
            </button>
          ))}
        </fieldset>
      </div>

      <TabsContent value="automatic" className="flex flex-col gap-2">
        <p className="max-w-xl text-sm text-muted-foreground">
          Writes the illustration and any shared file it imports. Nothing else
          in your project is touched.
        </p>
        <InstallCommand command={automatic[packageManager]} />
      </TabsContent>

      <TabsContent value="manual" className="flex flex-col gap-4">
        {packages.length > 0 ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Install the dependencies:
            </p>
            <InstallCommand command={dependencies?.[packageManager] ?? ""} />
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Copy each file into your project, keeping these paths:
          </p>
          {children}
        </div>
      </TabsContent>
    </Tabs>
  );
}
