import { cn } from "@/lib/utils";
import { Card, CardPanel, Text } from "./kit";

export function ToggleGroupIllustration({ className }: { className?: string }) {
  return (
    <Card className={cn("w-auto flex-row divide-x", className)}>
      <CardPanel className="bg-clip-padding p-4">
        <Text className="w-4" />
      </CardPanel>
      <CardPanel className="bg-muted-foreground/8 bg-clip-padding p-4">
        <Text className="w-4 bg-foreground" />
      </CardPanel>
      <CardPanel className="bg-clip-padding p-4">
        <Text className="w-4" />
      </CardPanel>
    </Card>
  );
}
