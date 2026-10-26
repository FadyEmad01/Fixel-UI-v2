import { cn } from "@/lib/utils";
import { Card, CardPanel, Text } from "./kit";

export function PreviewCardIllustration({ className }: { className?: string }) {
  return (
    <Card className={cn("max-w-50", className)}>
      <CardPanel className="flex items-center gap-3 p-4">
        <div className="size-9 shrink-0 rounded-full bg-muted-foreground/20" />
        <div className="flex flex-1 flex-col gap-2">
          <Text className="w-[70%]" variant="main" />
          <Text variant="secondary" />
          <Text className="w-[90%]" variant="secondary" />
        </div>
      </CardPanel>
    </Card>
  );
}
