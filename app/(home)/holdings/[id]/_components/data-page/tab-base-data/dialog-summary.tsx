import { TradeRecord } from "@/lib/services/trade-records/trade-record";
import React from "react";
import { ResponsiveDialog } from "@/components/ui/my/responsive-dialog";
import { TradeRecordType } from "@/lib/enums/trade-record-type";
import { Separator } from "@/components/ui/separator";
import { InlineDisplay } from "@/components/ui/my/inline-display";
import {
  formatMoney,
  formatShares,
  getTickerChangeColorClass,
} from "@/lib/market-utils";
import { HoldingInfoContext } from "@/app/(home)/holdings/[id]/_providers/holding-info";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";

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
  };
}

const description = `仅${[
  TradeRecordType.Buy,
  TradeRecordType.Sell,
  TradeRecordType.Subscribe,
  TradeRecordType.Redeem,
  TradeRecordType.Dividend,
]
  .map((t) => t.label)
  .join("、")}类型的交易参与汇总计算`;

export const DialogSummary = ({
  disabled,
  records,
}: {
  disabled: boolean;
  records: TradeRecord[];
}) => {
  const { data } = React.useContext(HoldingInfoContext);
  const [summary, setSummary] = React.useState<SummaryData | null>(null);

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
              content: data?.quote?.formatter(summary.buy.price),
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
              content: data?.quote?.formatter(summary.sell.price),
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
              title: "做T份额",
              content: formatShares(summary.t.shares),
            },
            {
              title: "做T差价",
              content: (
                <div className={summary.t.className}>
                  {data?.quote?.formatter(summary.t.gap)}
                </div>
              ),
            },
            {
              title: "做T收益",
              content: (
                <div className={summary.t.className}>
                  {formatMoney(summary.t.amount)}
                </div>
              ),
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

  return (
    <ResponsiveDialog
      title={"汇总展示"}
      description={description}
      trigger={
        <Button disabled={disabled} variant={"outline"} size={"sm"}>
          <Layers />
          汇总展示
        </Button>
      }
      onOpen={() => {
        const filteredRecords = records.filter((r) =>
          [
            TradeRecordType.Buy,
            TradeRecordType.Sell,
            TradeRecordType.Subscribe,
            TradeRecordType.Redeem,
            TradeRecordType.Dividend,
          ].includes(r.props.type),
        );

        const result = {
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
          },
        };
        filteredRecords.forEach((r) => {
          if (r.derived.shares > 0) {
            result.buy.count++;
            result.buy.shares += r.derived.shares;
            result.buy.amount += r.derived.amount;
          } else if (r.derived.shares < 0) {
            result.sell.count++;
            result.sell.shares += r.derived.shares;
            result.sell.amount += r.derived.amount;
          } else {
            console.log(r);
            result.dividend.count++;
            result.dividend.amount += r.derived.amount;
          }
        });
        result.buy.price = result.buy.amount / result.buy.shares;
        result.sell.price = result.sell.amount / result.sell.shares;
        result.t.shares = Math.min(
          result.buy.shares,
          Math.abs(result.sell.shares),
        );
        result.t.gap = result.sell.price - result.buy.price;
        result.t.amount = result.t.gap * result.t.shares;
        result.t.className = getTickerChangeColorClass(result.t.gap);

        setSummary(result);
      }}
      onClosed={() => setSummary(null)}
    >
      {displayList.map((item, index) => (
        <React.Fragment key={index}>
          {item}
          {index < displayList.length - 1 && <Separator className="my-4" />}
        </React.Fragment>
      ))}
    </ResponsiveDialog>
  );
};
