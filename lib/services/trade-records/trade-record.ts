import { TradeRecordType } from "@/lib/enums/trade-record-type";

interface TradeRecordProps {
  holdingId: number;
  type: TradeRecordType;
  factor?: number;
  shares: number;
  price: number;
  amount?: number;
  fee?: number;
  comment?: string;
  tradedAt: Date;
  id?: number;
}

export class TradeRecord {
  constructor(public props: TradeRecordProps) {
    this.props.factor ??= 1;
    this.props.amount ??= 0;
    this.props.fee ??= 0;
    this.props.comment ??= "";
  }

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
      fee: model.fee,
      comment: model.comment,
      tradedAt: new Date(model.traded_at),
      id: model.id,
    });
  }
}

export interface TradeRecordModel {
  id?: number;
  holding_id: number;
  type: number;
  factor: number;
  shares: number;
  price: number;
  amount: number;
  fee: number;
  comment: string;
  traded_at: string;
}
