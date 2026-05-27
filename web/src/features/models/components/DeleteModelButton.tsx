import { useState } from "react";

import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { type GetModelResult } from "@/src/features/models/validation";
import { usePostHogClientCapture } from "@/src/features/posthog-analytics/usePostHogClientCapture";
import { useHasProjectAccess } from "@/src/features/rbac/utils/checkProjectAccess";
import { api } from "@/src/utils/api";
import { useTranslations } from "next-intl";

export const DeleteModelButton = ({
  modelData,
  projectId,
  onSuccess,
}: {
  modelData: GetModelResult;
  projectId: string;
  onSuccess?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const utils = api.useUtils();
  const capture = usePostHogClientCapture();
  const t = useTranslations("models");
  const tCommon = useTranslations("common");
  const mut = api.models.delete.useMutation({
    onSuccess: () => {
      void utils.models.invalidate();
      onSuccess?.();
    },
  });

  const hasAccess = useHasProjectAccess({
    projectId,
    scope: "models:CUD",
  });

  return (
    <Popover open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          title={t("actions.deleteModel")}
          disabled={!hasAccess}
          className="flex items-center border-light-red"
        >
          <span className="text-dark-red">{tCommon("actions.delete")}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h2 className="text-md mb-3 font-semibold">
          {t("actions.deleteModelConfirmTitle")}
        </h2>
        <p className="mb-3 text-sm">
          {t("actions.deleteModelConfirmDescription")}
        </p>
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="destructive"
            loading={mut.isPending}
            onClick={() => {
              capture("models:delete_button_click");
              mut.mutateAsync({
                projectId,
                modelId: modelData.id,
              });

              setIsOpen(false);
            }}
          >
            {t("actions.deleteModel")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
