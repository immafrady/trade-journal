import { TradeRecord, TradeRecordType } from "@/lib/services/trade-records";
import React from "react";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers";
import { InlineDisplay } from "@/components/ui/my/inline-display";
import {
  formatMoney,
  formatShares,
  getTickerChangeColorClass,
} from "@/lib/market-utils";
import { Separator } from "@/components/ui/separator";

interface SummaryData {
  buy: {
    count: number;
    amount: number;
    shares: number;
    price: number;
  };
  sell: {
    count: number;
    amount: number;
    shares: number;
    price: number;
  };
  dividend: {
    count: number;
    amount: number;
  };
  t: {
    shares: number;
    gap: number;
    amount: number;
    className: string;
    netShares: number;
  };
}

export const SelectedSummary = ({ records }: { records: TradeRecord[] }) => {
  const { ticker } = React.useContext(HoldingInfoContext)!;

  const summary = React.useMemo(() => {
    const filteredRecords = records.filter((r) =>
      [
        TradeRecordType.Buy,
        TradeRecordType.Sell,
        TradeRecordType.Subscribe,
        TradeRecordType.Redeem,
        TradeRecordType.Dividend,
      ].includes(r.props.type),
    );

    const result: SummaryData = {
      buy: {
        count: 0,
        amount: 0,
        shares: 0,
        price: 0,
      },
      sell: {
        count: 0,
        amount: 0,
        shares: 0,
        price: 0,
      },
      dividend: {
        count: 0,
        amount: 0,
      },
      t: {
        shares: 0,
        gap: 0,
        amount: 0,
        className: "",
        netShares: 0,
      },
    };
    filteredRecords.forEach((r) => {
      if (r.adjusted.shares > 0) {
        result.buy.count++;
        result.buy.shares += r.adjusted.shares;
        result.buy.amount += r.adjusted.amount;
      } else if (r.adjusted.shares < 0) {
        result.sell.count++;
        result.sell.shares += r.adjusted.shares;
        result.sell.amount += r.adjusted.amount;
      } else {
        result.dividend.count++;
        result.dividend.amount += r.adjusted.amount;
      }
    });
    result.buy.price = result.buy.amount / result.buy.shares;
    result.sell.price = result.sell.amount / result.sell.shares;
    result.t.shares = Math.min(result.buy.shares, Math.abs(result.sell.shares));
    result.t.gap = result.sell.price - result.buy.price;
    result.t.amount = result.t.gap * result.t.shares;
    result.t.className = getTickerChangeColorClass(result.t.gap);
    result.t.netShares = result.buy.shares + result.sell.shares;

    return result;
  }, [records]);

  // 构建展示
  const displayList: React.ReactNode[] = [];
  if (summary) {
    if (summary.buy.count) {
      displayList.push(
        <InlineDisplay
          list={[
            {
              title: "买入次数",
              content: summary.buy.count,
            },
            {
              title: "买入金额",
              content: formatMoney(summary.buy.amount),
            },
            {
              title: "买入份额",
              content: formatShares(summary.buy.shares),
            },
            {
              title: "买入均价",
              content: ticker.formatter(summary.buy.price),
            },
          ]}
        />,
      );
    }
    if (summary.sell.count) {
      displayList.push(
        <InlineDisplay
          list={[
            {
              title: "卖出次数",
              content: summary.sell.count,
            },
            {
              title: "卖出金额",
              content: formatMoney(-summary.sell.amount),
            },
            {
              title: "卖出份额",
              content: formatShares(summary.sell.shares),
            },
            {
              title: "卖出均价",
              content: ticker.formatter(summary.sell.price),
            },
          ]}
        />,
      );
    }
    if (summary.t.shares) {
      displayList.push(
        <InlineDisplay
          list={[
            {
              title: "做T收益",
              content: (
                <div className={summary.t.className}>
                  {formatMoney(summary.t.amount)}
                </div>
              ),
            },
            {
              title: "做T差价",
              content: (
                <div className={summary.t.className}>
                  {ticker.formatter(summary.t.gap)}
                </div>
              ),
            },
            {
              title: "做T份额",
              content: formatShares(summary.t.shares),
            },
            {
              title: "T后份额",
              content:
                (summary.t.netShares > 0 ? "+" : "") +
                formatShares(summary.t.netShares),
            },
          ]}
        />,
      );
    }

    if (summary.dividend.count) {
      displayList.push(
        <InlineDisplay
          list={[
            {
              title: "分红次数",
              content: summary.dividend.count,
            },
            {
              title: "分红金额",
              content: formatMoney(-summary.dividend.amount),
            },
          ]}
        />,
      );
    }
  }
  return displayList.map((item, index) => (
    <React.Fragment key={index}>
      {item}
      {index < displayList.length - 1 && <Separator className="my-2" />}
    </React.Fragment>
  ));
};
