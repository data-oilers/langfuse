import React, { useState } from "react";
import { useRouter } from "next/router";
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
import { PlusIcon } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/src/components/ui/table";
import startCase from "lodash/startCase";
import { getChartTypeDisplayName } from "@/src/features/widgets/chart-library/utils";
import { type DashboardWidgetChartType } from "@langfuse/shared/src/db";

export type WidgetItem = {
  id: string;
  name: string;
  description: string;
  view: string;
  chartType: string;
  createdAt: Date;
  updatedAt: Date;
};

interface SelectWidgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onSelectWidget: (widget: WidgetItem) => void;
  dashboardId: string;
}

export function SelectWidgetDialog({
  open,
  onOpenChange,
  projectId,
  onSelectWidget,
  dashboardId,
}: SelectWidgetDialogProps) {
  const router = useRouter();
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");

  // Fetch widgets
  const widgets = api.dashboardWidgets.all.useQuery(
    {
      projectId,
      orderBy: {
        column: "updatedAt",
        order: "DESC",
      },
    },
    {
      enabled: Boolean(projectId) && open,
    },
  );

  const handleNavigateToNewWidget = () => {
    router.push(`/project/${projectId}/widgets/new?dashboardId=${dashboardId}`);
  };

  const handleAddWidget = () => {
    if (selectedWidgetId) {
      const selectedWidget = widgets.data?.widgets.find(
        (widget) => widget.id === selectedWidgetId,
      );
      if (selectedWidget) {
        onSelectWidget(selectedWidget as WidgetItem);
        onOpenChange(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t("selectWidget.dialogTitle")}</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="max-h-[400px] overflow-y-auto">
            {widgets.isPending ? (
              <div className="py-8 text-center">
                {t("selectWidget.loadingWidgets")}
              </div>
            ) : widgets.isError ? (
              <div className="py-8 text-center text-destructive">
                Error: {widgets.error.message}
              </div>
            ) : widgets.data?.widgets.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                {t("selectWidget.noWidgetsFound")}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("selectWidget.nameHeader")}</TableHead>
                    <TableHead>{t("selectWidget.descriptionHeader")}</TableHead>
                    <TableHead>{t("selectWidget.viewTypeHeader")}</TableHead>
                    <TableHead>{t("selectWidget.chartTypeHeader")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {widgets.data?.widgets.map((widget) => (
                    <TableRow
                      key={widget.id}
                      onClick={() => setSelectedWidgetId(widget.id)}
                      className={`cursor-pointer hover:bg-muted ${
                        selectedWidgetId === widget.id ? "bg-muted" : ""
                      }`}
                    >
                      <TableCell className="font-medium">
                        {widget.name}
                      </TableCell>
                      <TableCell
                        className="truncate"
                        title={widget.description}
                      >
                        {widget.description}
                      </TableCell>
                      <TableCell>
                        {startCase(widget.view.toLowerCase())}
                      </TableCell>
                      <TableCell>
                        {getChartTypeDisplayName(
                          widget.chartType as DashboardWidgetChartType,
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogBody>

        <DialogFooter className="mt-4 flex justify-between">
          <Button onClick={handleNavigateToNewWidget} variant="outline">
            <PlusIcon className="mr-2 h-4 w-4" />
            {t("selectWidget.createNewWidget")}
          </Button>
          <div className="flex gap-2">
            <Button onClick={() => onOpenChange(false)} variant="outline">
              {tCommon("actions.cancel")}
            </Button>
            <Button onClick={handleAddWidget} disabled={!selectedWidgetId}>
              {t("selectWidget.addSelectedWidget")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
