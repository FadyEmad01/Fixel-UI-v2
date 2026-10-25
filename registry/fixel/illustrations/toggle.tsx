import { cn } from "@/lib/utils";
import { Card, CardPanel, Text } from "./kit";

export function ToggleIllustration({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-2",
        className,
      )}
    >
      <Card className="max-w-12">
        <CardPanel className="rounded-[inherit] p-4">
          <Text />
        </CardPanel>
      </Card>
      <Card className="max-w-12 shadow-none before:hidden">
        <CardPanel className="rounded-[inherit] bg-muted-foreground/8 p-4">
          <Text className="bg-primary" />
        </CardPanel>
      </Card>
    </div>
  );
}
