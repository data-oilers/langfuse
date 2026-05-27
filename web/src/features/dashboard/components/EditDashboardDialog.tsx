import React, { useState } from "react";
import { api } from "@/src/utils/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogBody,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { showSuccessToast } from "@/src/features/notifications/showSuccessToast";
import { showErrorToast } from "@/src/features/notifications/showErrorToast";
import { useTranslations } from "next-intl";

interface EditDashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  dashboardId: string;
  initialName: string;
  initialDescription: string;
}

export function EditDashboardDialog({
  open,
  onOpenChange,
  projectId,
  dashboardId,
  initialName,
  initialDescription,
}: EditDashboardDialogProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const utils = api.useUtils();
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");

  const updateDashboard = api.dashboard.updateDashboardMetadata.useMutation({
    onSuccess: () => {
      void utils.dashboard.invalidate();
      showSuccessToast({
        title: t("edit.updatedTitle"),
        description: t("edit.updatedDescription"),
      });
      onOpenChange(false);
    },
    onError: (e) => {
      showErrorToast(t("edit.updateFailedTitle"), e.message);
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      showErrorToast(t("edit.validationError"), t("edit.nameRequired"));
      return;
    }

    updateDashboard.mutate({
      projectId,
      dashboardId,
      name: name.trim(),
      description: description.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("edit.dialogTitle")}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("edit.nameLabel")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("edit.namePlaceholder")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{t("edit.descriptionLabel")}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("edit.descriptionPlaceholder")}
                rows={3}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <div className="flex gap-2">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              type="button"
            >
              {tCommon("actions.cancel")}
            </Button>
            <Button
              onClick={handleSave}
              type="button"
              loading={updateDashboard.isPending}
            >
              {t("edit.saveChanges")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
