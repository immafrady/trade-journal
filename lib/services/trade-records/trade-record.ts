import {
  TradeRecordType,
  TradeRecordTypeValue,
} from "@/lib/enums/trade-record-type";
import { TradeRecordConstants } from "@/lib/services/trade-records/constants";
import dayjs, { Dayjs } from "dayjs";

export class TradeRecord {
  constructor(public props: TradeRecordProps) {
    this.props.factor ??= 1;
    this.props.amount ??= 0;
    this.props.price ??= 0;
    this.props.fee ??= 0;
    this.props.comment ??= "";
    if (!this.props.amount && !this.props.price) {
      throw new Error(
        `
        “${TradeRecordConstants.Price}”或“${TradeRecordConstants.Amount}“必须有值
        - ${TradeRecordConstants.Price}: ${this.props.price}
        - ${TradeRecordConstants.Amount}: ${this.props.amount}
        
        原始数据：
        ${JSON.stringify(this.props)}
        `,
      );
    }
    this.props.comment ??= "";
    this.display = {
      tradedAt: dayjs(this.props.tradedAt).format("YYYY-MM-DD"),
      type: this.props.type.label,
    };
    const { price, shares, amount, fee } = this.props;
    this.calculated = {
      price: price || (amount && shares ? (amount - fee) / shares : 0),
      amount: amount || (price && shares ? price * shares + fee : 0),
      fee: fee || (price && amount && shares ? amount - price * shares : 0),
    };
  }

  public display: {
    tradedAt: string;
    type: string;
  };

  public calculated: {
    price: number;
    amount: number;
    fee: number;
  };

  /**
   * 数据库解析
   * @param model
   */
  static fromDatabase(model: TradeRecordModel) {
    const type = TradeRecordType.parseFromValue(model.type);
    if (!type) {
      throw new Error("无法解析交易类型");
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
      price: this.props.price!,
      shares: this.props.shares,
      traded_at: this.display.tradedAt,
      type: this.props.type.value,
      id: this.props.id,
    };
  }
}

interface TradeRecordProps {
  holdingId: number;
  type: TradeRecordType;
  factor?: number;
  shares: number;
  price?: number;
  amount?: number;
  fee?: number;
  comment?: string;
  tradedAt: Dayjs;
  id?: number;
}

export interface TradeRecordModel {
  id?: number;
  holding_id: number;
  type: TradeRecordTypeValue;
  factor: number;
  shares: number;
  price: number;
  amount: number;
  fee: number;
  comment: string;
  traded_at: string;
}
