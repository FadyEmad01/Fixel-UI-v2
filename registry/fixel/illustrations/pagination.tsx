import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardPanel, Icon, Text } from "./kit";

export function PaginationIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-1 items-center gap-4", className)}>
      <Card className="w-fit">
        <CardPanel className="flex items-center gap-2 p-2">
          <Icon icon={ChevronLeftIcon} />
        </CardPanel>
      </Card>
      <div className="flex flex-1 gap-2">
        <Text className="flex-1" variant="secondary" />
        <Text className="flex-1" variant="secondary" />
        <Text className="flex-1" variant="secondary" />
      </div>
      <Card className="w-fit">
        <CardPanel className="flex items-center gap-2 p-2">
          <Icon icon={ChevronRightIcon} />
        </CardPanel>
      </Card>
    </div>
  );
}
