import { ChevronRightIcon, EllipsisIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardPanel, Icon, Text } from "./kit";

export function MenuIllustration({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex max-w-50 flex-1 flex-col items-end gap-2", className)}
    >
      <Card className="w-fit">
        <CardPanel className="flex items-center gap-2 p-2">
          <Icon icon={EllipsisIcon} />
        </CardPanel>
      </Card>
      <Card>
        <CardPanel className="flex flex-col gap-4 p-4">
          <div className="me-6">
            <Text className="w-full" variant="secondary" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Text variant="secondary" />
            </div>
            <Icon className="-m-1" icon={ChevronRightIcon} />
          </div>
          <div className="me-6">
            <Text className="w-full" variant="secondary" />
          </div>
        </CardPanel>
      </Card>
    </div>
  );
}
