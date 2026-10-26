import { cn } from "@/lib/utils";
import { Text } from "./kit";

export function TabsIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("flex max-w-50 flex-col gap-4", className)}>
      <div className="flex rounded-lg bg-muted-foreground/12 p-0.5">
        <div className="rounded-[calc(var(--radius-lg)-1px)] bg-linear-to-b from-card to-card/90 p-3 shadow-xs/5 dark:from-background/90 dark:to-background">
          <Text className="w-6 bg-primary" />
        </div>
        <div className="rounded-[calc(var(--radius-lg)-1px)] p-3">
          <Text className="w-6" variant="secondary" />
        </div>
        <div className="rounded-[calc(var(--radius-lg)-1px)] p-3">
          <Text className="w-6" variant="secondary" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Text className="w-[70%]" />
        <Text variant="secondary" />
      </div>
    </div>
  );
}

export default TabsIllustration;
