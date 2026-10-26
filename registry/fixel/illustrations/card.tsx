import { cn } from "@/lib/utils";
import { Bar, Card, CardPanel, Text } from "./kit";

export function CardIllustration({ className }: { className?: string }) {
  return (
    <Card className={cn("max-w-36", className)}>
      <CardPanel className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <Text className="w-[60%]" variant="main" />
          <Text className="w-[90%]" variant="secondary" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-4 rounded-sm bg-muted-foreground/8" />
          <div className="h-4 rounded-sm bg-muted-foreground/8" />
          <Bar className="w-full rounded-sm" variant="primary" />
        </div>
      </CardPanel>
    </Card>
  );
}
