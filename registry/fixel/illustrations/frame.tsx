import { cn } from "@/lib/utils";
import { Card, CardPanel, Text } from "./kit";

export function FrameIllustration({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex-1 rounded-[calc(var(--radius-2xl)+2px)] bg-muted/72 p-1",
        className,
      )}
    >
      <div className="flex flex-col gap-2 p-4">
        <Text className="w-[70%]" />
      </div>
      <Card className="max-w-none">
        <CardPanel className="p-5">
          <div className="flex flex-col gap-2">
            <Text className="w-[70%]" />
            <Text className="w-[90%]" variant="secondary" />
          </div>
        </CardPanel>
      </Card>
    </div>
  );
}
