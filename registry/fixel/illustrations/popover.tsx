import { cn } from "@/lib/utils";
import { Card, CardPanel, Text } from "./kit";

export function PopoverIllustration({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex max-w-50 flex-1 flex-col items-center gap-2",
        className,
      )}
    >
      <Card className="w-fit">
        <CardPanel className="flex items-center gap-2 px-4 py-3">
          <Text className="w-12" variant="main" />
        </CardPanel>
      </Card>
      <Card>
        <CardPanel className="flex flex-col gap-3 p-4">
          <Text className="w-[70%]" variant="main" />
          <div className="flex flex-col gap-1.5">
            <Text className="w-[80%]" variant="secondary" />
            <Text className="w-[60%]" variant="secondary" />
          </div>
        </CardPanel>
      </Card>
    </div>
  );
}
