import { FragmentTemplate } from "@/app/(home)/holdings/[id]/import/_components/fragment-template";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Redo } from "lucide-react";

export function StepParseError({
  errors,
  onRedo,
}: {
  errors: Error[];
  onRedo: () => void;
}) {
  return (
    <FragmentTemplate
      title={<span className={"text-destructive"}>读取 CSV 文件异常</span>}
      actions={
        <Button onClick={onRedo}>
          <Redo />
          重新选择
        </Button>
      }
    >
      {errors.map((error, index) => (
        <div key={index}>
          {error.message.split("\n").map((line, idx) => (
            <p key={`${index}-${idx}`}>{line}</p>
          ))}
          <Separator />
        </div>
      ))}
    </FragmentTemplate>
  );
}
