/**
 * TraceGraphView wrapper for trace2
 *
 * This component wraps the TraceGraphView from features/trace-graph-view/
 * and uses data from GraphDataContext.
 */

import { TraceGraphView as TraceGraphViewComponent } from "@/src/features/trace-graph-view/components/TraceGraphView";
import { useTraceGraphData } from "../../contexts/TraceGraphDataContext";
import { useTranslations } from "next-intl";

export function TraceGraphView() {
  const t = useTranslations("traces");
  const { agentGraphData, isLoading } = useTraceGraphData();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-sm text-muted-foreground">
          {t("graphView.loadingGraph")}
        </span>
      </div>
    );
  }

  if (agentGraphData.length === 0) {
    return null;
  }

  return <TraceGraphViewComponent agentGraphData={agentGraphData} />;
}
