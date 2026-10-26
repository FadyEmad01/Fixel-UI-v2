import { cn } from "@/lib/utils";
import { Card, CardPanel, Text } from "./kit";

export function BadgeIllustration({ className }: { className?: string }) {
  return (
    <Card className={cn("max-w-24", className)}>
      <CardPanel className="flex items-center gap-2 px-2.5 py-2">
        <div className="size-2 rounded-full bg-muted-foreground/88" />
        <Text className="flex-1" />
      </CardPanel>
    </Card>
  );
}
