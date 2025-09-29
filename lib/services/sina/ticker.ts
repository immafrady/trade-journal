import { SinaStockType } from "@/lib/enums/sina-stock-type";

export class SinaTicker {
  constructor(
    public readonly type: SinaStockType,
    public readonly label: string,
    public readonly code: string,
  ) {
    this.key = `${type},${label},${code}`;
    if (this.type === SinaStockType.AShare) {
      this.stockSymbol = this.code;
      this.fundSymbol = "";
      this.searchCode = this.code;
    } else {
      this.stockSymbol = this.code.startsWith("5") ? "sh" : "sz" + this.code;
      this.fundSymbol = "of" + this.code;
      this.searchCode = `${this.stockSymbol},${this.fundSymbol}`;
    }
  }

  public readonly stockSymbol: string;
  public readonly fundSymbol: string;
  public readonly searchCode: string;

  public readonly key: string;
  /**
   * 来自新浪查询的请求
   * @param suggestion
   */
  static fromSuggestion(suggestion: string) {
    const slugs = suggestion.split(",");
    const type = slugs[1] as SinaStockType;
    return new SinaTicker(
      type,
      slugs[4],
      type === SinaStockType.AShare ? slugs[3] : slugs[2],
    );
  }

  /**
   * 从自定义key解析
   * @param key
   */
  static fromKey(key: string) {
    const slugs = key.split(",");
    const type = slugs[0] as SinaStockType;
    return new SinaTicker(type, slugs[1], slugs[2]);
  }
}
