import React from "react";
import Header from "@/src/components/layouts/header";
import { useHasProjectAccess } from "@/src/features/rbac/utils/checkProjectAccess";
import { ScoreConfigsTable } from "@/src/components/table/use-cases/score-configs";
import { useTranslations } from "next-intl";

export function ScoreConfigSettings({ projectId }: { projectId: string }) {
  const t = useTranslations("scores");
  const hasReadAccess = useHasProjectAccess({
    projectId: projectId,
    scope: "scoreConfigs:read",
  });

  if (!hasReadAccess) return null;

  return (
    <div id="score-configs">
      <Header title={t("configs.title")} />
      <p className="mb-2 text-sm">{t("configs.description")}</p>
      <ScoreConfigsTable projectId={projectId} />
    </div>
  );
}
