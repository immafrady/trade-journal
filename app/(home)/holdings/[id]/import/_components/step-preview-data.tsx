import { TradeRecord } from "@/lib/services/trade-records/trade-record";
import { FragmentTemplate } from "@/app/(home)/holdings/[id]/import/_components/fragment-template";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { motion } from "motion/react";

export function StepPreviewData({
  records,
  onRedo,
}: {
  records: TradeRecord[];
  onRedo: () => void;
}) {
  return (
    <FragmentTemplate
      title={"第二步：预览数据"}
      description={"请确认预览数据无误后，点击提交上传记录。"}
      actions={
        <div className={"flex gap-2"}>
          <motion.div layoutId={"primary-button"}>
            <Button>
              <Upload />
              提交数据
            </Button>
          </motion.div>
          <Button variant={"ghost"} onClick={onRedo}>
            我再想想
          </Button>
        </div>
      }
    >
      records
    </FragmentTemplate>
  );
}
