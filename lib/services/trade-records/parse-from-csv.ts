import Papa from "papaparse";
import { TradeRecord } from "@/lib/services/trade-records/trade-record";
import { TradeRecordConstants } from "@/lib/services/trade-records/constants";
import { TradeRecordType } from "@/lib/enums/trade-record-type";

export function parseFromCsv(
  file: any,
  holdingId: number,
): Promise<TradeRecord[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true, // 第一行作为表头
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.data.length) {
          reject([new Error("表格内容为空")]);
        }
        console.log("解析结果：", results.data);
        const list: TradeRecord[] = [];
        const errors: TradeRecordCsvParseError[] = [];

        (results.data as Record<string, string | undefined>[]).forEach(
          (item) => {
            const e = new TradeRecordCsvParseError(item);
            // 开始解析
            // 交易日期
            const tradedAt = new Date(
              item[TradeRecordConstants.TradedAt] ?? "null", // 防报错
            );
            if (isNaN(tradedAt.getTime())) {
              e.add(TradeRecordConstants.TradedAt, "日期格式无效");
            }
            // 交易类型
            const type = TradeRecordType.parseFromLabel(
              item[TradeRecordConstants.Type],
            );
            if (!type) {
              e.add(TradeRecordConstants.Type, "无法识别的交易类型");
            }
            // 系数
            const factor = item[TradeRecordConstants.Factor];
            if (!(isEmpty(factor) || isInteger(factor))) {
              e.add(TradeRecordConstants.Factor, "可不填，但若填写必须为整数");
            }
            // 份额
            const shares = item[TradeRecordConstants.Shares];
            if (isNumber(shares)) {
              e.add(TradeRecordConstants.Shares, "必须为数字");
            }

            // 价格
            const price = item[TradeRecordConstants.Price];
            if (isNumber(price)) {
              e.add(TradeRecordConstants.Price, "必须为数字");
            }

            // 金额
            const amount = item[TradeRecordConstants.Amount];
            if (!(isEmpty(amount) || isNumber(amount))) {
              e.add(TradeRecordConstants.Amount, "可不填，但若填写必须为数字");
            }

            // 费用
            const fee = item[TradeRecordConstants.Fee];
            if (!(isEmpty(fee) || isNumber(fee))) {
              e.add(TradeRecordConstants.Fee, "可不填，但若填写必须为数字");
            }

            // 备注
            if (e.message) {
              errors.push(e);
            } else {
              list.push(
                new TradeRecord({
                  holdingId,
                  type: type!,
                  factor: toOptionalNumber(factor),
                  shares: +shares!,
                  price: +price!,
                  amount: toOptionalNumber(amount),
                  fee: toOptionalNumber(fee),
                  comment: item[TradeRecordConstants.Comment],
                  tradedAt,
                }),
              );
            }
          },
        );

        if (errors.length) {
          reject(errors);
        } else {
          resolve(list);
        }
      },
      error(error: Error, file: string) {
        reject([error]);
      },
    });
  });
}

const isEmpty = (v: any) => v === undefined || v === null || v === "";
const isNumber = (v: any) => !Number.isNaN(+v);
const isInteger = (v: any) => Number.isInteger(+v);
const toOptionalNumber = (v: any) => (v ? +v : undefined);

class TradeRecordCsvParseError extends Error {
  constructor(public data: Record<string, string | undefined>) {
    super();
  }
  get message() {
    return this.messages.join(";\n");
  }
  public messages: string[] = [];

  add(label: string, reason: string) {
    this.messages.push(`[${label}] “${this.data[label]}” - ${reason}`);
  }
}
