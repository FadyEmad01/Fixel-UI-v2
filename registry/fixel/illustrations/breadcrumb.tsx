import { ChevronRightIcon } from "lucide-react";
import { Card, CardPanel, Icon, Text } from "./kit";

export function BreadcrumbIllustration({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardPanel className="flex items-center gap-1 p-3">
        <Text className="flex-1" />
        <Icon icon={ChevronRightIcon} />
        <Text className="flex-1" variant="secondary" />
        <Icon icon={ChevronRightIcon} />
        <Text className="flex-1" variant="secondary" />
      </CardPanel>
    </Card>
  );
}
