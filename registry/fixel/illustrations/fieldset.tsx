import { cn } from "@/lib/utils";
import { FormField } from "./kit";

export function FieldsetIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("flex max-w-50 flex-1 flex-col gap-4", className)}>
      <FormField />
      <FormField />
    </div>
  );
}

export default FieldsetIllustration;
