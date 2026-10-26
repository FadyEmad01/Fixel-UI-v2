import { ChevronDownIcon } from "lucide-react";
import { Card, CardPanel, Icon, Text } from "./kit";

export function CollapsibleIllustration({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardPanel className="divide-y divide-border p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <Text className="w-[60%]" />
          <Icon icon={ChevronDownIcon} />
        </div>
        <div className="flex flex-col gap-2 p-4">
          <Text className="w-[80%]" variant="secondary" />
          <Text className="w-[70%]" variant="secondary" />
        </div>
      </CardPanel>
    </Card>
  );
}

export default CollapsibleIllustration;
