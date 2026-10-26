import { UserRoundIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardPanel, Icon } from "./kit";

export function AvatarIllustration({ className }: { className?: string }) {
  return (
    <Card className={cn("size-12", className)}>
      <CardPanel className="flex items-center justify-center p-0">
        <div className="flex size-full items-center justify-center rounded-full">
          <Icon icon={UserRoundIcon} />
        </div>
      </CardPanel>
    </Card>
  );
}

export default AvatarIllustration;
