import { cn } from "@/lib/utils";
import { RadioItem } from "./kit";

export function RadioGroupIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("flex max-w-28 flex-1 flex-col gap-3", className)}>
      <RadioItem />
      <RadioItem checked />
    </div>
  );
}
