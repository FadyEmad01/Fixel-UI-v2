import { MinusIcon, PlusIcon } from "lucide-react";
import { Card, CardPanel, Icon, Text } from "./kit";

export function NumberFieldIllustration({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardPanel className="flex items-center gap-2 px-4 py-2.5">
        <Icon className="shrink-0" icon={MinusIcon} />
        <div className="flex flex-1 justify-center">
          <Text className="w-12" />
        </div>
        <Icon className="shrink-0" icon={PlusIcon} />
      </CardPanel>
    </Card>
  );
}
