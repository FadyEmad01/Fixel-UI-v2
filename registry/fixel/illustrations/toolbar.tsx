import { cn } from "@/lib/utils";
import { Card, CardPanel, Text } from "./kit";

export function ToolbarIllustration({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center gap-1 rounded-xl border p-1", className)}
    >
      <Card className="w-fit">
        <CardPanel className="p-3.5">
          <Text className="w-4" />
        </CardPanel>
      </Card>
      <Card className="w-fit">
        <CardPanel className="p-3.5">
          <Text className="w-4" />
        </CardPanel>
      </Card>
      <Card className="w-fit">
        <CardPanel className="p-3.5">
          <Text className="w-4" />
        </CardPanel>
      </Card>
    </div>
  );
}

export default ToolbarIllustration;
