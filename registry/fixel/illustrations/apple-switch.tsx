// test any new components here

import { cn } from "@/lib/utils";

export function AppleSwitchIllustration({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-6 w-16 rounded-full bg-muted-foreground/20 p-0.5",
        className,
      )}
    >
      <div className="size-5 rounded-full bg-linear-to-b from-card to-card/90 shadow-xs/5 dark:from-background/90 dark:to-background px-4.5" />
    </div>
  );
}

export default AppleSwitchIllustration;
