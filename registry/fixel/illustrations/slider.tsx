import { cn } from "@/lib/utils";
import { Text } from "./kit";

export function SliderIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full max-w-50 items-center gap-1", className)}>
      <Text
        className="w-[35%] bg-linear-to-b from-primary/90 to-primary"
        variant="secondary"
      />
      <div className="size-4 rounded-full bg-linear-to-b from-primary/90 to-primary" />
      <Text className="flex-1" variant="secondary" />
    </div>
  );
}
