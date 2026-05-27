/**
 * Simple metadata badges for ObservationDetailView
 * Each badge handles its own null checks and returns null when data is unavailable
 */

import { Badge } from "@/src/components/ui/badge";
import { formatIntervalSeconds } from "@/src/utils/dates";
import { useTranslations } from "next-intl";

export function LatencyBadge({
  latencySeconds,
}: {
  latencySeconds: number | null;
}) {
  const t = useTranslations("traces");
  if (latencySeconds == null) return null;

  return (
    <Badge variant="tertiary">
      {t("badges.latency", { value: formatIntervalSeconds(latencySeconds) })}
    </Badge>
  );
}

export function TimeToFirstTokenBadge({
  timeToFirstToken,
}: {
  timeToFirstToken: number | null | undefined;
}) {
  const t = useTranslations("traces");
  if (timeToFirstToken == null) return null;

  return (
    <Badge variant="tertiary">
      {t("badges.timeToFirstToken", {
        value: formatIntervalSeconds(timeToFirstToken),
      })}
    </Badge>
  );
}

export function EnvironmentBadge({
  environment,
}: {
  environment: string | null | undefined;
}) {
  const t = useTranslations("traces");
  if (!environment) return null;

  return <Badge variant="tertiary">{t("badges.env", { environment })}</Badge>;
}

export function VersionBadge({
  version,
}: {
  version: string | null | undefined;
}) {
  const t = useTranslations("traces");
  if (!version) return null;

  return <Badge variant="tertiary">{t("badges.version", { version })}</Badge>;
}

export function LevelBadge({ level }: { level: string | null | undefined }) {
  if (!level || level === "DEFAULT") return null;

  return (
    <Badge
      variant={
        level === "ERROR"
          ? "destructive"
          : level === "WARNING"
            ? "warning"
            : "tertiary"
      }
    >
      {level}
    </Badge>
  );
}

export function StatusMessageBadge({
  statusMessage,
}: {
  statusMessage: string | null | undefined;
}) {
  if (!statusMessage) return null;

  return <Badge variant="tertiary">{statusMessage}</Badge>;
}
