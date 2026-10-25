import { ChevronDownIcon } from "lucide-react";
import { Card, CardPanel, Icon, Text } from "./kit";

export function SelectIllustration({ className }: { className?: string }) {
  return (
    <Card className={className} withGradient={false}>
      <CardPanel className="flex gap-2 p-0">
        <div className="flex flex-1 items-center justify-between gap-2 py-2.5 ps-4 pe-2.5">
          <Text className="w-[60%]" />
          <Icon icon={ChevronDownIcon} />
        </div>
      </CardPanel>
    </Card>
  );
}
