import { cn } from "@/lib/utils";
import { Text } from "./kit";

export function SkeletonIllustration({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mask-[linear-gradient(100deg,black_0%,rgba(0,0,0,0.2)_20%,rgba(0,0,0,0.2)_80%,rgba(0,0,0,0.6)_100%)] flex max-w-50 flex-1 items-center gap-3",
        className,
      )}
    >
      <div className="size-8 rounded-full bg-muted-foreground/20" />
      <div className="flex flex-1 flex-col gap-2">
        <Text className="w-full" variant="secondary" />
        <Text className="w-full" variant="secondary" />
      </div>
    </div>
  );
}
