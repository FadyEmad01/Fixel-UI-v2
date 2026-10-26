import { cn } from "@/lib/utils";
import { Card, CardPanel, Text } from "./kit";

export function LabelIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("flex max-w-50 flex-1 flex-col gap-3", className)}>
      <Text className="w-16 bg-primary" />
      <Card withGradient={false}>
        <CardPanel className="py-3.5" />
      </Card>
    </div>
  );
}

export default LabelIllustration;
