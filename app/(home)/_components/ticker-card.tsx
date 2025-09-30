import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getSinaStockTypeColor,
  getSinaStockTypeLabel,
} from "@/lib/enums/sina-stock-type";
import React from "react";
import { SinaTicker } from "@/lib/services/sina/ticker";
import { SinaQuote } from "@/lib/services/sina/quote";

export const TickerCard = ({
  ticker,
  quote,
}: {
  ticker: SinaTicker;
  quote?: SinaQuote;
}) => {
  return (
    <Card key={ticker.key} className={"gap-2 py-4"}>
      <CardHeader>
        <CardTitle className={"flex items-center gap-1"}>
          <Badge className={getSinaStockTypeColor(ticker.type)}>
            {getSinaStockTypeLabel(ticker.type)}
          </Badge>
          {ticker.label}
        </CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};
