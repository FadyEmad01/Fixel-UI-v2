import { cn } from "@/lib/utils";
import { Card, CardPanel, Text } from "./kit";

export function ScrollAreaIllustration({ className }: { className?: string }) {
  return (
    <Card className={cn("max-w-36", className)}>
      <CardPanel className="relative p-0">
        <div className="flex flex-col gap-2 p-3">
          <Text className="w-[80%]" variant="secondary" />
          <Text className="w-[90%]" variant="secondary" />
          <Text className="w-[70%]" variant="secondary" />
          <Text className="w-[85%]" variant="secondary" />
          <Text className="w-[90%]" variant="secondary" />
          <Text className="w-[80%]" variant="secondary" />
        </div>
        <div className="absolute top-2 right-1 h-8 w-1 rounded-full bg-muted-foreground/40" />
      </CardPanel>
    </Card>
  );
}

export default ScrollAreaIllustration;
