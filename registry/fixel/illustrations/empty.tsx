import { cn } from "@/lib/utils";
import { Card, CardPanel, Text } from "./kit";

export function EmptyIllustration({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "border-input border-dashed bg-none shadow-none before:hidden",
        className,
      )}
    >
      <CardPanel className="flex flex-col items-center gap-2">
        <div className="size-8 rounded-full bg-muted-foreground/20" />
        <Text className="w-[60%]" />
        <Text className="w-[80%]" variant="secondary" />
      </CardPanel>
    </Card>
  );
}

export default EmptyIllustration;
