import { LoadingButton } from "@/components/ui/my/button";
import { FileSpreadsheet } from "lucide-react";
import { TradeRecordType } from "@/lib/enums/trade-record-type";
import React from "react";
import { parseFromCsv } from "@/lib/services/trade-records/parse-from-csv";
import { TradeRecordConstants } from "@/lib/services/trade-records/constants";
import { TradeRecord } from "@/lib/services/trade-records/trade-record";
import { FragmentTemplate } from "@/app/(home)/holdings/[id]/import/_components/fragment-template";
import { motion } from "motion/react";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";

const schema = [
  {
    label: TradeRecordConstants.TradedAt,
    required: true,
    description: "“yyyy-MM-dd”格式的日期文字",
  },
  {
    label: TradeRecordConstants.Type,
    required: true,
    description: `识别中文值${TradeRecordType.values
      .map((type) => `"${type.label}"`)
      .join("、")}`,
  },
  {
    label: TradeRecordConstants.Shares,
    description: `
      交易的份额变化
      · “买入”、“申购”、“拆股”时填正数
      · “卖出”、“赎回”、“合股”时填负数
      · “分红”填0
      * 与“${TradeRecordConstants.Price}”、“${TradeRecordConstants.Amount}”三选二填写
      `,
  },
  {
    label: TradeRecordConstants.Price,
    description: `
      交易发生的价格
      · “分红”、“拆股”、“合股”填0
      * 与“${TradeRecordConstants.Shares}”、“${TradeRecordConstants.Amount}”三选二填写
    `,
  },
  {
    label: TradeRecordConstants.Amount,
    required: false,
    description: `
    包含手续费的金额
    · 默认通过“成交份额x成交价格+交易费用”推导出来
    * 与“${TradeRecordConstants.Shares}”、“${TradeRecordConstants.Price}”三选二填写
    `,
  },
  {
    label: TradeRecordConstants.Fee,
    required: false,
    description:
      "交易发生的各种费用，默认为0\n可通过“成交金额-成交份额x成交价格”推导出来",
  },
  {
    label: TradeRecordConstants.Factor,
    required: false,
    description: "默认为1，用于合并多个相同交易",
  },
  {
    label: TradeRecordConstants.Comment,
    required: false,
    description: "随便写点什么都行",
  },
];

export function StepChooseFile({
  onPick,
  onErrors,
}: {
  onPick: (records: TradeRecord[]) => void;
  onErrors: (errors: Error[]) => void;
}) {
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const { id } = React.useContext(HoldingInfoContext);
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <FragmentTemplate
      title={"第一步：上传 CSV 文件"}
      description={"请确保文件内包含以下表头信息，并按照所需的数据类型填写表格"}
      actions={
        <>
          <input
            type="file"
            id="csvFile"
            className="hidden"
            accept={"text/csv"}
            onChange={async (e) => {
              setLoading(true);
              const file = e.target.files?.[0];
              if (file) {
                try {
                  const data = await parseFromCsv(file, +id);
                  onPick(data);
                } catch (e: any) {
                  onErrors(e);
                }
              }
              setLoading(false);
            }}
            ref={fileRef}
          />
          <motion.div layoutId={"primary-button"}>
            <LoadingButton
              loading={loading}
              type={"button"}
              onClick={() => fileRef.current?.click()}
            >
              <FileSpreadsheet />
              选取文件
            </LoadingButton>
          </motion.div>
        </>
      }
    >
      <div className={"grid grid-cols-1 md:grid-cols-2 gap-2"}>
        {schema.map((item, idx) => (
          <div key={idx}>
            <h3 className={"font-medium text-base"}>
              {idx + 1}. {item.label}
              <span className={"text-sm"}>
                {item.required ? "（必填项）" : ""}
              </span>
            </h3>
            <div className={"text-muted-foreground text-justify"}>
              {item.description.split("\n").map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </FragmentTemplate>
  );
}
