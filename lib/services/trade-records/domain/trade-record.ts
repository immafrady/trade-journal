import {
  TradeRecordConstants,
  TradeRecordType,
  TradeRecordTypeValue,
} from "@/lib/services/trade-records";
import dayjs, { Dayjs } from "dayjs";
import {
  formatMoney,
  formatPercent,
  formatShares,
  StockValueFormatter,
} from "@/lib/market-utils";

export class TradeRecord {
  constructor(public props: TradeRecordProps) {
    // 校验必填字段
    switch (this.props.type) {
      case TradeRecordType.Buy:
      case TradeRecordType.Sell:
      case TradeRecordType.Subscribe:
      case TradeRecordType.Redeem: {
        if (
          [this.props.amount, this.props.shares, this.props.price].filter(
            (v) => !!v,
          ).length < 2
        ) {
          throw new Error(
            `
            “${this.props.type.label}”类型以下字段三选二必填：${TradeRecordConstants.Shares}、${TradeRecordConstants.Price}、${TradeRecordConstants.Amount}
            - ${TradeRecordConstants.Shares}: ${this.props.shares}
            - ${TradeRecordConstants.Price}: ${this.props.price}
            - ${TradeRecordConstants.Amount}: ${this.props.amount}
            `,
          );
        }
        break;
      }
      case TradeRecordType.Dividend: {
        if (!this.props.amount) {
          throw new Error(
            `“${this.props.type.label}”类型必填字段：${TradeRecordConstants.Amount}`,
          );
        }
        break;
      }
      case TradeRecordType.Split:
      case TradeRecordType.Merge: {
        if (!this.props.shares) {
          throw new Error(
            `“${this.props.type.label}”类型必填字段：${TradeRecordConstants.Shares}`,
          );
        }
        break;
      }
    }

    this.props.factor ??= 1;
    this.props.comment ??= "";
    this.display = {
      tradedAt: dayjs(this.props.tradedAt).format("YYYY-MM-DD"),
      type: this.props.type.label,
      feeRate: "",
    };
    const { price, shares, amount, fee = 0, factor } = this.props;
    this.derived = {
      price: price || (amount && shares ? (amount - fee) / shares : 0),
      amount: amount || (price && shares ? price * shares + fee : 0),
      fee: fee || (price && amount && shares ? amount - price * shares : 0),
      shares: shares || (amount && price ? (amount - fee) / price : 0),
    };
    this.adjusted = {
      amount: this.derived.amount * factor,
      fee: this.derived.fee * factor,
      shares: this.derived.shares * factor,
    };
    this.display.feeRate = formatPercent(
      Math.abs((this.derived.fee / this.derived.amount) * 100),
      3,
    );
  }

  // 展示
  public display: {
    tradedAt: string;
    type: string;
    feeRate: string;
  };

  // 调整后（怕参数不全）
  public derived: {
    price: number;
    amount: number;
    fee: number;
    shares: number;
  };

  // 加权
  public adjusted: {
    amount: number;
    fee: number;
    shares: number;
  };

  // 截止至今（后续计算）
  public cumulative: {
    totalAmount: number; // 实际支出
    totalShares: number;
    costPrice: number; // 当前成本
    marketValue: number; // 市值
    valueIndex: number; // “市值 / 实际支出” 算出来的净值
  } = {
    totalAmount: 0,
    totalShares: 0,
    costPrice: 0,
    marketValue: 0,
    valueIndex: 0,
  };

  // 额外参数
  public meta: {
    isDraft: boolean; // 是否未完成（手续费不能算出来）
  } = {
    isDraft: false,
  };

  /**
   * 数据库解析
   * @param model
   */
  static fromDatabase(model: TradeRecordModel) {
    const type = TradeRecordType.parseFromValue(model.type);
    if (!type) {
      throw new Error(
        `无法解析交易类型: ${model.type}, 原始数据: ${JSON.stringify(model)}`,
      );
    }
    return new TradeRecord({
      holdingId: model.holding_id,
      type,
      factor: model.factor,
      shares: model.shares,
      price: model.price,
      amount: model.amount,
      fee: model.fee,
      comment: model.comment,
      tradedAt: dayjs(model.traded_at),
      id: model.id,
    });
  }

  static fromCSV(model: TradeRecordCSVModel) {
    const type = TradeRecordType.parseFromValue(+model.type);
    if (!type) {
      throw new Error(
        `无法解析交易类型: ${model.type}, 原始数据: ${JSON.stringify(model)}`,
      );
    }
    return new TradeRecord({
      holdingId: +model.holding_id,
      type,
      factor: +model.factor,
      shares: +model.shares || undefined,
      price: +model.price || undefined,
      amount: +model.amount || undefined,
      fee: +model.fee || undefined,
      comment: model.comment,
      tradedAt: dayjs(model.traded_at),
      id: +model.id,
    });
  }

  // 转化为json，默认使用数据库格式
  toJSON(): TradeRecordModel {
    return {
      amount: this.props.amount!,
      comment: this.props.comment!,
      factor: this.props.factor!,
      fee: this.props.fee,
      holding_id: this.props.holdingId,
      price: this.props.price,
      shares: this.props.shares,
      traded_at: this.display.tradedAt,
      type: this.props.type.value,
      id: this.props.id,
    };
  }

  toCSVObject(formatter: StockValueFormatter) {
    return {
      [TradeRecordConstants.TradedAt]: this.display.tradedAt,
      [TradeRecordConstants.Type]: this.display.type,
      [TradeRecordConstants.Shares]: formatShares(this.derived.shares),
      [TradeRecordConstants.Price]: formatter(this.derived.price),
      [TradeRecordConstants.Amount]: formatMoney(this.derived.amount),
      [TradeRecordConstants.Fee]: formatMoney(this.derived.fee),
      [TradeRecordConstants.Factor]: this.props.factor,
      [TradeRecordConstants.Comment]: this.props.comment,
    };
  }
}

interface TradeRecordProps {
  holdingId: number;
  type: TradeRecordType;
  factor?: number;
  shares?: number;
  price?: number;
  amount?: number;
  fee?: number;
  comment?: string;
  tradedAt: Dayjs;
  id?: number;
}

// 数据库内保存
export interface TradeRecordModel {
  id?: number;
  holding_id: number;
  type: TradeRecordTypeValue;
  factor: number;
  shares?: number;
  price?: number;
  amount?: number;
  fee?: number;
  comment: string;
  traded_at: string;
}

// CSV解析
export interface TradeRecordCSVModel {
  id: string;
  holding_id: string;
  type: string;
  factor: string;
  shares: string;
  price: string;
  amount: string;
  fee: string;
  comment: string;
  traded_at: string;
}
