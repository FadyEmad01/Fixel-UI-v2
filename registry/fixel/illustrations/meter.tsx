import { cn } from "@/lib/utils";
import { Text } from "./kit";

export function MeterIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("flex max-w-50 flex-1 flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <Text className="w-[50%]" />
        <Text className="w-8" />
      </div>
      <div className="h-2 w-full rounded-full bg-muted-foreground/20">
        <div className="h-2 w-[65%] rounded-s-full bg-linear-to-b from-primary/90 to-primary" />
      </div>
    </div>
  );
}

export default MeterIllustration;
