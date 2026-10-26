import { cn } from "@/lib/utils";
import { FormField } from "./kit";

export function FieldIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("flex max-w-50 flex-1 flex-col gap-3", className)}>
      <FormField showError />
    </div>
  );
}

export default FieldIllustration;
