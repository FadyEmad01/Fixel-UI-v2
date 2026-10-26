import { TextCursorIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardPanel, Icon, Text } from "./kit";

export function AutocompleteIllustration({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("flex max-w-50 flex-1 flex-col gap-2", className)}>
      <Card withGradient={false}>
        <CardPanel className="flex items-center gap-2 px-4 py-2">
          <Text className="w-[40%]" />
          <Icon icon={TextCursorIcon} />
        </CardPanel>
      </Card>
      <Card>
        <CardPanel className="flex flex-col gap-4 p-4">
          <Text variant="secondary" />
          <Text variant="secondary" />
          <Text variant="secondary" />
        </CardPanel>
      </Card>
    </div>
  );
}
