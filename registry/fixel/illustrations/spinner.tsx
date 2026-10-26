import { cn } from "@/lib/utils";

export function SpinnerIllustration({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "size-8 rotate-45 rounded-full border-3 border-muted-foreground/20 border-t-primary",
        className,
      )}
    />
  );
}

export default SpinnerIllustration;
