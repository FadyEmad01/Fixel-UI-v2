import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardPanel, Icon, Text } from "./kit";

export function AccordionIllustration({ className }: { className?: string }) {
  return (
    <Card className={cn("max-w-50", className)}>
      <CardPanel className="divide-y divide-border p-0">
        <div className="p-3">
          <div className="flex items-center gap-2">
            <Icon icon={ChevronDownIcon} />
            <Text className="w-[60%]" />
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-2">
            <Icon className="rotate-180" icon={ChevronDownIcon} />
            <div className="flex flex-1 flex-col gap-2">
              <Text className="w-[50%]" variant="main" />
              <Text className="w-[90%]" variant="secondary" />
            </div>
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-2">
            <Icon icon={ChevronDownIcon} />
            <Text className="w-[60%]" />
          </div>
        </div>
      </CardPanel>
    </Card>
  );
}

export default AccordionIllustration;
