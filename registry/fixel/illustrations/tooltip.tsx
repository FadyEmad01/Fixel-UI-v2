import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardPanel, Icon, Text } from "./kit";

export function TooltipIllustration({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex max-w-32 flex-1 flex-col items-center gap-2",
        className,
      )}
    >
      <Card>
        <CardPanel className="p-4">
          <Text />
        </CardPanel>
      </Card>
      <Icon icon={InfoIcon} />
    </div>
  );
}
