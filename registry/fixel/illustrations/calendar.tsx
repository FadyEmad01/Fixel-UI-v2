import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardPanel, Icon, Text } from "./kit";

export function CalendarIllustration({ className }: { className?: string }) {
  return (
    <Card className={cn("max-w-36", className)}>
      <CardPanel className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-2">
          <Icon icon={ChevronLeftIcon} />
          <Text className="w-[60%]" variant="secondary" />
          <Icon icon={ChevronRightIcon} />
        </div>
        <div className="flex items-center gap-2">
          <Text className="flex-1" variant="secondary" />
          <Text className="flex-1" variant="secondary" />
          <Text className="flex-1" variant="main" />
          <Text className="flex-1 bg-transparent" variant="main" />
          <Text className="flex-1" variant="main" />
        </div>
        <div className="flex items-center gap-2">
          <Text className="flex-1" variant="main" />
          <Text className="flex-1 bg-transparent" variant="main" />
          <Text className="flex-1" variant="main" />
          <Text className="flex-1" variant="main" />
          <Text className="flex-1" variant="main" />
        </div>
        <div className="flex items-center gap-2">
          <Text className="flex-1 bg-transparent" variant="main" />
          <Text className="flex-1" variant="main" />
          <Text className="flex-1 bg-primary" variant="main" />
          <Text className="flex-1" variant="main" />
          <Text className="flex-1 bg-transparent" variant="main" />
        </div>
        <div className="flex items-center gap-2">
          <Text className="flex-1" variant="main" />
          <Text className="flex-1" variant="main" />
          <Text className="flex-1 bg-transparent" variant="main" />
          <Text className="flex-1" variant="secondary" />
          <Text className="flex-1" variant="secondary" />
        </div>
      </CardPanel>
    </Card>
  );
}
