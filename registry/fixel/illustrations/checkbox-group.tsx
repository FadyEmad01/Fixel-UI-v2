import { cn } from "@/lib/utils";
import { CheckboxItem } from "./kit";

export function CheckboxGroupIllustration({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("flex max-w-28 flex-1 flex-col gap-3", className)}>
      <CheckboxItem checked />
      <CheckboxItem className="ps-4" />
      <CheckboxItem checked className="ps-4" />
      <CheckboxItem />
    </div>
  );
}

export default CheckboxGroupIllustration;
