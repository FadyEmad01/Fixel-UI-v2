import { cn } from "@/lib/utils";
import { Bar, Card, CardPanel, Text } from "./kit";

export function AlertDialogIllustration({ className }: { className?: string }) {
  return (
    <Card className={cn("max-w-50", className)}>
      <CardPanel className="flex flex-col gap-5 p-4">
        <div className="flex flex-col gap-2">
          <Text className="w-[50%]" variant="main" />
          <Text className="w-[90%]" variant="secondary" />
        </div>
        <div className="flex items-center justify-end gap-2">
          <Bar variant="secondary" />
          <Bar variant="primary" />
        </div>
      </CardPanel>
    </Card>
  );
}

export default AlertDialogIllustration;
