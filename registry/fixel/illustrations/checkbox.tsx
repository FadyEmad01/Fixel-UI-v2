import { cn } from "@/lib/utils";
import { CheckboxItem } from "./kit";

export function CheckboxIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("flex max-w-28 flex-1 flex-col gap-3", className)}>
      <CheckboxItem />
      <CheckboxItem checked />
    </div>
  );
}
