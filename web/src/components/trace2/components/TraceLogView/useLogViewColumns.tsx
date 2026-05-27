/**
 * Hook for defining log view table columns.
 *
 * Extracts column configuration from TraceLogView for cleaner separation
 * of concerns. Columns include observation name, depth, start time, and duration.
 */

import { useMemo } from "react";
import { type JSONTableViewColumn } from "@/src/components/trace2/components/_shared/JSONTableView";
import { type FlatLogItem } from "./log-view-types";
import { LogViewObservationCell } from "./LogViewObservationCell";
import { formatRelativeTime, formatDuration } from "./log-view-formatters";
import { useTranslations } from "next-intl";

export interface UseLogViewColumnsParams {
  /** Whether indent visualization is enabled */
  indentEnabled: boolean;
  /** Whether milliseconds are shown in time values */
  showMilliseconds: boolean;
  /** Project ID for data fetching */
  projectId: string;
  /** Trace ID for data fetching */
  traceId: string;
}

/**
 * Hook for defining log view table columns.
 */
export function useLogViewColumns({
  indentEnabled,
  showMilliseconds,
  projectId,
  traceId,
}: UseLogViewColumnsParams): JSONTableViewColumn<FlatLogItem>[] {
  const t = useTranslations("traces");
  return useMemo((): JSONTableViewColumn<FlatLogItem>[] => {
    return [
      {
        key: "observation",
        header: t("columns.observation"),
        width: "flex-1",
        render: (item) => (
          <LogViewObservationCell
            item={item}
            indentEnabled={indentEnabled}
            projectId={projectId}
            traceId={traceId}
          />
        ),
      },
      {
        key: "depth",
        header: t("columns.depth"),
        width: "w-12",
        align: "right" as const,
        render: (item) => (
          <span className="text-xs text-muted-foreground">
            {item.node.depth >= 0 ? `L${item.node.depth}` : "-"}
          </span>
        ),
      },
      {
        key: "start",
        header: t("columns.start"),
        width: showMilliseconds ? "w-20" : "w-12",
        align: "right" as const,
        render: (item) => (
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(
              item.node.startTimeSinceTrace,
              showMilliseconds,
            )}
          </span>
        ),
      },
      {
        key: "duration",
        header: t("columns.duration"),
        width: "w-16",
        align: "right" as const,
        render: (item) => (
          <span className="text-xs text-muted-foreground">
            {formatDuration(item.node.startTime, item.node.endTime)}
          </span>
        ),
      },
    ];
  }, [indentEnabled, showMilliseconds, projectId, traceId, t]);
}
