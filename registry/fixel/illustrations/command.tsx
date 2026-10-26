import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardPanel, CommandItem, Icon, Text } from "./kit";

export function CommandIllustration({ className }: { className?: string }) {
  return (
    <Card className={cn("max-w-50", className)}>
      <CardPanel className="divide-y divide-border p-0">
        <div className="flex items-center gap-2 px-4 py-3">
          <Icon icon={SearchIcon} />
          <Text className="w-[40%]" />
        </div>
        <div className="flex flex-col gap-4 p-4">
          <CommandItem />
          <CommandItem />
          <CommandItem />
        </div>
      </CardPanel>
    </Card>
  );
}
