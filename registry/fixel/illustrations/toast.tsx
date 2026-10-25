import { AlertCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardPanel, Icon, Text } from "./kit";

export function ToastIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex flex-1 justify-center", className)}>
      <Card className="absolute -top-6 scale-80">
        <CardPanel className="flex items-center gap-2 p-3" />
      </Card>
      <Card className="absolute -top-3 scale-90">
        <CardPanel className="flex items-center gap-2 p-3" />
      </Card>
      <Card>
        <CardPanel className="flex items-start gap-2 p-3">
          <Icon icon={AlertCircleIcon} />
          <div className="flex flex-1 flex-col gap-2">
            <Text className="w-[40%]" />
            <Text className="w-[70%]" variant="secondary" />
          </div>
        </CardPanel>
      </Card>
    </div>
  );
}
