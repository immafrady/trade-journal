import Papa from "papaparse";
import { TradeRecord } from "@/lib/services/trade-records/trade-record";
import { TradeRecordConstants } from "@/lib/services/trade-records/constants";
import { TradeRecordType } from "@/lib/enums/trade-record-type";
import dayjs from "dayjs";

export function parseFromCsv(
  file: any,
  holdingId: number,
): Promise<TradeRecord[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true, // 第一行作为表头
      complete: (results) => {
        if (!results.data.length) {
          reject([new Error("表格内容为空")]);
        }
        const list: TradeRecord[] = [];
        const errors: Error[] = [];

        (results.data as Record<string, string | undefined>[]).forEach(
          (item, idx) => {
            const e = new TradeRecordCsvParseError(item, idx);
            // 开始解析
            // 交易日期
            const tradedAt = dayjs(item[TradeRecordConstants.TradedAt]);
            if (!tradedAt.isValid()) {
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
            if (!(Utils.isEmpty(factor) || Utils.isInteger(factor))) {
              e.add(TradeRecordConstants.Factor, "可不填，但若填写必须为整数");
            }
            // 份额
            const shares = item[TradeRecordConstants.Shares];
            if (!Utils.isNumber(shares)) {
              e.add(TradeRecordConstants.Shares, "必须为数字");
            }

            // 价格
            const price = item[TradeRecordConstants.Price];
            if (!Utils.isNumber(price)) {
              e.add(TradeRecordConstants.Price, "可不填，但若填写必须为数字");
            }

            // 金额
            const amount = item[TradeRecordConstants.Amount];
            if (!(Utils.isEmpty(amount) || Utils.isNumber(amount))) {
              e.add(TradeRecordConstants.Amount, "可不填，但若填写必须为数字");
            }

            // 费用
            const fee = item[TradeRecordConstants.Fee];
            if (!(Utils.isEmpty(fee) || Utils.isNumber(fee))) {
              e.add(TradeRecordConstants.Fee, "可不填，但若填写必须为数字");
            }

            // 备注
            if (e.hasError) {
              errors.push(e);
            } else {
              try {
                list.push(
                  new TradeRecord({
                    holdingId,
                    type: type!,
                    factor: Utils.toOptionalNumber(factor),
                    shares: +shares!,
                    price: Utils.toOptionalNumber(price),
                    amount: Utils.toOptionalNumber(amount),
                    fee: Utils.toOptionalNumber(fee),
                    comment: item[TradeRecordConstants.Comment],
                    tradedAt,
                  }),
                );
              } catch (err: any) {
                e.addError(err);
                errors.push(e);
              }
            }
          },
        );

        if (errors.length) {
          reject(errors);
        } else {
          resolve(list);
        }
      },
      error(error: Error) {
        reject([error]);
      },
    });
  });
}

const Utils = {
  isEmpty: (v: any) => v === undefined || v === null || v === "",
  isNumber: (v: any) => !Number.isNaN(+v),
  isInteger: (v: any) => Number.isInteger(+v),
  toOptionalNumber: (v: any) => (v ? +v : undefined),
};

class TradeRecordCsvParseError extends Error {
  constructor(
    public data: Record<string, string | undefined>,
    public index: number,
  ) {
    super();
  }
  get message() {
    return `第${this.index + 1}条：\n${this.messages.join(";\n")}`;
  }
  get hasError() {
    return !!this.messages.length;
  }
  public messages: string[] = [];

  add(label: string, reason: string) {
    this.messages.push(`[${label}] “${this.data[label]}” - ${reason}`);
  }
  addError(e: Error) {
    this.messages.push(e.message);
  }
}
