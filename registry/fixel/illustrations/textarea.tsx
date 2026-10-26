import { Card, CardPanel, Text } from "./kit";

export function TextareaIllustration({ className }: { className?: string }) {
  return (
    <Card className={className} withGradient={false}>
      <CardPanel className="flex flex-col gap-2 px-6 py-4">
        <Text className="w-[60%]" />
        <Text className="opacity-0" />
        <Text className="opacity-0" />
      </CardPanel>
    </Card>
  );
}

export default TextareaIllustration;
