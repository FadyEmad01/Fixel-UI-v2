import { SearchIcon } from "lucide-react";
import { Card, CardPanel, Icon, Text } from "./kit";

export function InputGroupIllustration({ className }: { className?: string }) {
  return (
    <Card className={className} withGradient={false}>
      <CardPanel className="flex gap-2 p-0">
        <div className="flex flex-1 items-center gap-2 py-2.5 ps-4">
          <Icon icon={SearchIcon} />
          <Text className="w-[60%]" />
        </div>
        <div className="flex items-center py-2.5 pe-4">
          <div className="size-4 shrink-0 rounded bg-muted-foreground/20" />
        </div>
      </CardPanel>
    </Card>
  );
}
