import { cn } from "@/lib/utils";
import { Bar, Card, CardPanel, Text } from "./kit";

export function SheetIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full flex-1 gap-2", className)}>
      <div className="flex-1 rounded-xl border border-input border-dashed" />
      <Card className="h-full max-w-1/3">
        <CardPanel className="flex flex-col gap-4 p-3">
          <div className="flex flex-1 flex-col gap-2">
            <Text className="w-[60%]" variant="main" />
            <Text variant="secondary" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Bar variant="primary" />
          </div>
        </CardPanel>
      </Card>
    </div>
  );
}
