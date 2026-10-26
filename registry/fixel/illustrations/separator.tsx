import { cn } from "@/lib/utils";
import { Text } from "./kit";

export function SeparatorIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("max-w-50 flex-1 divide-y", className)}>
      <div className="flex flex-col gap-2 py-3">
        <Text className="w-[60%]" />
        <Text variant="secondary" />
      </div>
      <div className="flex items-center gap-2 divide-x py-3">
        <div className="-mx-2 flex-1 px-2 py-1">
          <Text variant="secondary" />
        </div>
        <div className="flex-1 px-2 py-1">
          <Text variant="secondary" />
        </div>
        <div className="-mx-2 flex-1 px-2 py-1">
          <Text variant="secondary" />
        </div>
        <div className="flex-1 px-2 py-1">
          <Text variant="secondary" />
        </div>
      </div>
    </div>
  );
}

export default SeparatorIllustration;
