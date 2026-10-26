import { cn } from "@/lib/utils";

export function ProgressIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("flex max-w-50 flex-1 flex-col gap-2", className)}>
      <div className="h-2 w-full rounded-full bg-muted-foreground/20">
        <div className="h-2 w-[45%] rounded-s-full bg-linear-to-b from-primary/90 to-primary" />
      </div>
    </div>
  );
}

export default ProgressIllustration;
