import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Shared primitives for the illustration set.
 *
 * Every illustration installs this file next to itself, so the shapes stay
 * identical across the catalog without duplicating the wireframe CSS.
 */

export function Icon({
  icon: IconComponent,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <IconComponent
      className={cn("size-4 text-muted-foreground/88", className)}
    />
  );
}

export function Text({
  className,
  variant = "main",
}: {
  className?: string;
  variant?: "main" | "secondary";
}) {
  const bgColor =
    variant === "main" ? "bg-muted-foreground/40" : "bg-muted-foreground/20";
  return <div className={cn("h-1.5 rounded-full", bgColor, className)} />;
}

/**
 * A filled pill standing in for a button — never a real control, so it stays a
 * div and keeps the illustration out of the tab order.
 */
export function Bar({
  variant = "secondary",
  className,
}: {
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const height = variant === "primary" ? "h-4" : "h-1.5";
  const bgColor =
    variant === "primary"
      ? "bg-linear-to-b from-primary/90 to-primary"
      : "bg-muted-foreground/20";
  return <div className={cn(height, "w-7 rounded-sm", bgColor, className)} />;
}

export function Card({
  children,
  className,
  withGradient = true,
}: {
  children: ReactNode;
  className?: string;
  withGradient?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex w-full max-w-72 flex-col rounded-2xl border not-dark:bg-clip-padding text-card-foreground shadow-md/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_-1px_rgba(255,255,255,0.06),0_1px_rgba(0,0,0,0.06)]",
        withGradient
          ? "bg-linear-to-b from-[color-mix(in_srgb,var(--card)_96%,var(--color-white))] to-[color-mix(in_srgb,var(--card)_99%,var(--color-black))] dark:to-[color-mix(in_srgb,var(--card)_98%,var(--color-white))]"
          : "bg-card/99 dark:bg-card",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardPanel({
  children,
  className,
  ...props
}: {
  children?: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CheckboxItem({
  checked = false,
  className,
}: {
  checked?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "size-4 shrink-0 rounded",
          checked
            ? "bg-linear-to-b from-primary/90 to-primary"
            : "bg-muted-foreground/20",
        )}
      />
      <Text className="w-full" variant="secondary" />
    </div>
  );
}

export function RadioItem({
  checked = false,
  className,
}: {
  checked?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "size-4 shrink-0 rounded-full",
          checked
            ? "bg-linear-to-b from-primary/90 to-primary"
            : "bg-muted-foreground/20",
        )}
      />
      <Text className="w-full" variant="secondary" />
    </div>
  );
}

export function FormField({
  labelWidth = "w-16",
  showError = false,
}: {
  labelWidth?: string;
  showError?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Text className={labelWidth} />
      <Card withGradient={false}>
        <CardPanel className="py-3.5" />
      </Card>
      {showError && <Text className="w-[80%]" variant="secondary" />}
    </div>
  );
}

export function TableRow({ showCheckbox = true }: { showCheckbox?: boolean }) {
  return (
    <div className="flex items-center gap-2 p-3">
      {showCheckbox && <Text className="size-2.5 rounded-xs" />}
      <Text className="flex-1" />
      <Text className="flex-1" variant="secondary" />
      <Text className="flex-1" variant="secondary" />
      <Text className="flex-1" variant="secondary" />
      <Text className="flex-1" variant="secondary" />
    </div>
  );
}

export function CommandItem() {
  return (
    <div className="flex items-center justify-between gap-2">
      <Text className="w-[65%]" variant="secondary" />
      <Text className="w-4" variant="secondary" />
    </div>
  );
}
