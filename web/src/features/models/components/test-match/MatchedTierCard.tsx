import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { useMemo } from "react";
import { usePriceUnitMultiplier } from "@/src/features/models/hooks/usePriceUnitMultiplier";
import Decimal from "decimal.js";
import { getMaxDecimals } from "@/src/features/models/utils";
import { useTranslations } from "next-intl";

type MatchedTierCardProps = {
  tier: {
    id: string;
    name: string;
    priority: number;
    isDefault: boolean;
    prices: Record<string, number>;
  };
};

export type { MatchedTierCardProps };

export function MatchedTierCard({ tier }: MatchedTierCardProps) {
  const t = useTranslations("models");
  const { priceUnit, priceUnitMultiplier } = usePriceUnitMultiplier();

  const maxDecimals = useMemo(
    () =>
      Math.max(
        ...Object.values(tier.prices).map((price) =>
          getMaxDecimals(price, priceUnitMultiplier),
        ),
      ),
    [tier.prices, priceUnitMultiplier],
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("testMatch.matchedPricingTier")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold">{tier.name}</span>
          {tier.isDefault && (
            <Badge variant="secondary" className="text-xs">
              {t("pricing.default")}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {t("pricing.priority")}: {tier.priority}
          </span>
        </div>

        <div>
          <div className="mb-2 text-xs font-medium text-muted-foreground">
            {t("pricing.prices")} ({t("pricing.pricesPerUnit")} {priceUnit}):
          </div>
          <div className="space-y-1.5">
            {Object.entries(tier.prices).map(([usageType, price]) => (
              <div
                key={usageType}
                className="flex items-center justify-between rounded bg-muted/50 px-3 py-1.5"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {usageType}:
                </span>
                <span className="font-mono text-sm font-semibold">
                  $
                  {new Decimal(price)
                    .mul(priceUnitMultiplier)
                    .toFixed(maxDecimals)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
