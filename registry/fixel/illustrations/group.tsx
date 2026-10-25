import { cn } from "@/lib/utils";
import { Card, CardPanel, Text } from "./kit";

export function GroupIllustration({ className }: { className?: string }) {
  return (
    <Card className={cn("max-w-48 flex-row divide-x", className)}>
      <CardPanel className="px-6 py-4">
        <Text />
      </CardPanel>
      <CardPanel className="px-6 py-4">
        <Text />
      </CardPanel>
    </Card>
  );
}
