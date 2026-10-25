import { CalendarIcon } from "lucide-react";
import { Card, CardPanel, Icon, Text } from "./kit";

export function DatePickerIllustration({ className }: { className?: string }) {
  return (
    <Card className={className} withGradient={false}>
      <CardPanel className="flex items-center gap-2 p-3">
        <Icon icon={CalendarIcon} />
        <Text className="w-[60%]" />
      </CardPanel>
    </Card>
  );
}
