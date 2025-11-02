import {
  TradeRecordType,
  TradeRecordTypeValue,
} from "@/lib/enums/trade-record-type";
import { TradeRecordConstants } from "@/lib/services/trade-records/constants";
import dayjs, { Dayjs } from "dayjs";

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
    this.props.fee ??= 0;
    this.props.comment ??= "";
    this.props.comment ??= "";
    this.display = {
      tradedAt: dayjs(this.props.tradedAt).format("YYYY-MM-DD"),
      type: this.props.type.label,
    };
    const { price, shares, amount, fee, factor } = this.props;
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
  }

  // 展示
  public display: {
    tradedAt: string;
    type: string;
  };

  // 调整后（怕参数不全）
  public derived: {
    price: number;
    amount: number;
    fee: number;
    shares: number;
  };

  // 算上系数
  public adjusted: {
    amount: number;
    fee: number;
    shares: number;
  };

  // 截止至今（后续计算）
  public cumulative: {
    totalAmount: number;
    totalShares: number;
    costPrice: number;
  } = {
    totalAmount: 0,
    totalShares: 0,
    costPrice: 0,
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

  // 转化为json，默认使用数据库格式
  toJSON(): TradeRecordModel {
    return {
      amount: this.props.amount!,
      comment: this.props.comment!,
      factor: this.props.factor!,
      fee: this.props.fee!,
      holding_id: this.props.holdingId,
      price: this.props.price,
      shares: this.props.shares,
      traded_at: this.display.tradedAt,
      type: this.props.type.value,
      id: this.props.id,
    };
  }

  toCSVObject() {
    return {
      [TradeRecordConstants.TradedAt]: this.display.tradedAt,
      [TradeRecordConstants.Type]: this.display.type,
      [TradeRecordConstants.Shares]: this.props.shares,
      [TradeRecordConstants.Price]: this.props.price,
      [TradeRecordConstants.Amount]: this.props.amount,
      [TradeRecordConstants.Fee]: this.props.fee,
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
  fee: number;
  comment: string;
  traded_at: string;
}
