import { isNumericDataType } from "@/src/features/scores/lib/helpers";
import { isPresent, type ScoreConfigDomain } from "@langfuse/shared";
import React from "react";
import { useTranslations } from "next-intl";

export function ScoreConfigDetails({ config }: { config: ScoreConfigDomain }) {
  const t = useTranslations("scores");
  const { name, description, minValue, maxValue, dataType } = config;
  if (!description && !isPresent(minValue) && !isPresent(maxValue)) return null;
  const isNameTruncated = name.length > 20;

  return (
    <div className="text-wrap bg-background p-2 text-xs font-light">
      {!!description && (
        <p>{t("configs.detailDescription", { description })}</p>
      )}
      {isNumericDataType(dataType) &&
      (isPresent(minValue) || isPresent(maxValue)) ? (
        <p>
          {t("configs.detailRange", {
            min: minValue ?? "-∞",
            max: maxValue ?? "∞",
          })}
        </p>
      ) : null}
      {isNameTruncated && <p>{t("configs.detailFullName", { name })}</p>}
    </div>
  );
}
