import React, { useState } from "react";
import { api } from "@/src/utils/api";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogBody,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/src/components/ui/table";

export interface SelectDashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onSelectDashboard: (dashboardId: string) => void;
  onSkip: () => void;
}

export function SelectDashboardDialog({
  open,
  onOpenChange,
  projectId,
  onSelectDashboard,
  onSkip,
}: SelectDashboardDialogProps) {
  const [selectedDashboardId, setSelectedDashboardId] = useState<string | null>(
    null,
  );
  const t = useTranslations("dashboard");

  const dashboards = api.dashboard.allDashboards.useQuery(
    {
      projectId,
      orderBy: {
        column: "updatedAt",
        order: "DESC",
      },
      page: 0,
      limit: 100,
    },
    {
      enabled: Boolean(projectId) && open,
    },
  );

  const handleAdd = () => {
    if (selectedDashboardId) {
      onSelectDashboard(selectedDashboardId);
      onOpenChange(false);
    }
  };

  const handleSkip = () => {
    onSkip();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t("selectDashboard.dialogTitle")}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="mt-4 max-h-[400px] overflow-y-auto">
            {dashboards.isLoading ? (
              <div className="py-8 text-center">
                {t("selectDashboard.loadingDashboards")}
              </div>
            ) : dashboards.isError ? (
              <div className="py-8 text-center text-destructive">
                Error: {dashboards.error.message}
              </div>
            ) : dashboards.data?.dashboards.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                {t("selectDashboard.noDashboardsFound")}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("selectDashboard.nameHeader")}</TableHead>
                    <TableHead>
                      {t("selectDashboard.descriptionHeader")}
                    </TableHead>
                    <TableHead>{t("selectDashboard.updatedHeader")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboards.data?.dashboards
                    .filter((d) => d.owner === "PROJECT")
                    .map((d) => (
                      <TableRow
                        key={d.id}
                        onClick={() => setSelectedDashboardId(d.id)}
                        className={`cursor-pointer hover:bg-muted ${
                          selectedDashboardId === d.id ? "bg-muted" : ""
                        }`}
                      >
                        <TableCell className="font-medium">{d.name}</TableCell>
                        <TableCell className="truncate" title={d.description}>
                          {d.description}
                        </TableCell>
                        <TableCell>
                          {new Date(d.updatedAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogBody>
        <DialogFooter className="mt-4 flex justify-between">
          <Button variant="outline" onClick={handleSkip}>
            {t("selectDashboard.skip")}
          </Button>
          <Button onClick={handleAdd} disabled={!selectedDashboardId}>
            {t("selectDashboard.addToDashboard")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
