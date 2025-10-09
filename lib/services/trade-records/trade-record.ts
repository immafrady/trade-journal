import { TradeRecordType } from "@/lib/enums/trade-record-type";

export class TradeRecord {
  private constructor(
    public holdingId: number,
    public type: TradeRecordType,
    public factor: number,
    public price: number,
    public amount: number,
    public fee: number,
    public comment: string,
    public tradedAt: Date,
    public id?: number,
  ) {}

  /**
   * 数据库解析
   * @param model
   */
  static fromDatabase(model: TradeRecordModel) {
    return new TradeRecord(
      model.holding_id,
      model.type,
      model.factor,
      model.price,
      model.amount,
      model.fee,
      model.comment,
      new Date(model.traded_at),
      model.id,
    );
  }
}

export interface TradeRecordModel {
  id?: number;
  holding_id: number;
  type: TradeRecordType;
  factor: number;
  shares: number;
  price: number;
  amount: number;
  fee: number;
  comment: string;
  traded_at: string;
}

interface TradeRecordForm {}
