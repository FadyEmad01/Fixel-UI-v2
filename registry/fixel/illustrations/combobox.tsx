import { XIcon } from "lucide-react";
import { Card, CardPanel, Icon, Text } from "./kit";

export function ComboboxIllustration({ className }: { className?: string }) {
  return (
    <Card className={className} withGradient={false}>
      <CardPanel className="flex items-center gap-2 px-3 py-[calc(--spacing(2.5)-1px)]">
        <div className="flex h-5 items-center gap-1 rounded-sm bg-muted-foreground/8 py-0.5 ps-2 pe-1">
          <Text className="w-6" />
          <Icon icon={XIcon} />
        </div>
        <div className="flex h-5 items-center gap-1 rounded-sm bg-muted-foreground/8 py-0.5 ps-2 pe-1">
          <Text className="w-6" />
          <Icon icon={XIcon} />
        </div>
      </CardPanel>
    </Card>
  );
}
