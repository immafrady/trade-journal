import {
  getSinaStockTypeColor,
  getSinaStockTypeLabel,
  SinaStockType,
} from "@/lib/services/sina";
import { Badge } from "@/components/ui/badge";
import React from "react";

export const SinaStockTypeBadge = ({ type }: { type: SinaStockType }) => {
  const label = getSinaStockTypeLabel(type);
  const color = getSinaStockTypeColor(type);
  return <Badge className={color}>{label}</Badge>;
};
