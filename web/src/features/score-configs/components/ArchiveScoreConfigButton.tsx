import { Archive } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import React from "react";
import { usePostHogClientCapture } from "@/src/features/posthog-analytics/usePostHogClientCapture";
import { useHasProjectAccess } from "@/src/features/rbac/utils/checkProjectAccess";
import { api } from "@/src/utils/api";
import { useEmptyScoreConfigs } from "@/src/features/scores/hooks/useEmptyConfigs";

export const ArchiveScoreConfigButton = ({
  configId,
  projectId,
  isArchived,
  name,
}: {
  configId: string;
  projectId: string;
  isArchived: boolean;
  name: string;
}) => {
  const t = useTranslations("scores");
  const capture = usePostHogClientCapture();
  const { emptySelectedConfigIds, setEmptySelectedConfigIds } =
    useEmptyScoreConfigs();

  const hasAccess = useHasProjectAccess({
    projectId: projectId,
    scope: "scoreConfigs:CUD",
  });

  const utils = api.useUtils();
  const configMutation = api.scoreConfigs.update.useMutation({
    onSuccess: () => void utils.scoreConfigs.invalidate(),
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full items-center justify-start"
          disabled={!hasAccess}
          onClick={(e) => {
            e.stopPropagation();
            capture("score_configs:archive_form_open");
          }}
        >
          <Archive className="mr-2 h-4 w-4"></Archive>
          {isArchived ? t("configs.restoreConfig") : t("configs.archiveConfig")}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onClick={(e) => e.stopPropagation()}
        className="max-w-[500px]"
      >
        <h2 className="text-md mb-3 font-semibold">
          {isArchived ? t("configs.restoreConfig") : t("configs.archiveConfig")}
        </h2>
        <p className="mb-3 text-sm">
          {isArchived
            ? t("configs.restoreDescription", { name })
            : t("configs.archiveDescription", { name })}
        </p>
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant={isArchived ? "default" : "destructive"}
            loading={configMutation.isPending}
            onClick={() => {
              void configMutation.mutateAsync({
                projectId,
                id: configId,
                isArchived: !isArchived,
              });
              setEmptySelectedConfigIds(
                emptySelectedConfigIds.filter((id) => id !== configId),
              );
              capture("score_configs:archive_form_submit");
            }}
          >
            Confirm
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
