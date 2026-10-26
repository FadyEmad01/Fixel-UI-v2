import { AlertCircleIcon } from "lucide-react";
import { Card, CardPanel, Icon, Text } from "./kit";

export function AlertIllustration({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardPanel className="flex items-center gap-2 p-3">
        <Icon icon={AlertCircleIcon} />
        <Text className="w-[70%]" variant="secondary" />
      </CardPanel>
    </Card>
  );
}

export default AlertIllustration;
