import { TextCursorIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardPanel, Icon, Text } from "./kit";

export function InputOtpIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("flex max-w-50 flex-1 items-center gap-2", className)}>
      <Card className="size-10" withGradient={false}>
        <CardPanel className="flex items-center justify-center p-0">
          <Text className="size-1.5" />
        </CardPanel>
      </Card>
      <Card className="size-10" withGradient={false}>
        <CardPanel className="flex items-center justify-center p-0">
          <Text className="size-1.5" />
        </CardPanel>
      </Card>
      <Card className="size-10" withGradient={false}>
        <CardPanel className="flex items-center justify-center p-0">
          <Text className="size-1.5" />
        </CardPanel>
      </Card>
      <Card className="size-10" withGradient={false}>
        <CardPanel className="flex items-center justify-center p-0">
          <Icon icon={TextCursorIcon} />
        </CardPanel>
      </Card>
    </div>
  );
}
