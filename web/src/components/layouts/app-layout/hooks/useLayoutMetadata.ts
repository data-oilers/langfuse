/**
 * Hook to generate layout metadata (page titles, favicons, etc.)
 * Based on active navigation and environment
 */

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useLangfuseCloudRegion } from "@/src/features/organizations/hooks";
import { env } from "@/src/env.mjs";
import type { NavigationItem } from "@/src/components/layouts/utilities/routes";

const TITLE_TO_KEY: Record<string, string> = {
  "Go to...": "goTo",
  Organizations: "organizations",
  Projects: "projects",
  Home: "home",
  Dashboards: "dashboards",
  Tracing: "tracing",
  Sessions: "sessions",
  Users: "users",
  Prompts: "prompts",
  Playground: "playground",
  Scores: "scores",
  "LLM-as-a-Judge": "llmAsJudge",
  "Human Annotation": "humanAnnotation",
  Datasets: "datasets",
  Upgrade: "upgrade",
  Settings: "settings",
  Support: "support",
  "Book a call": "bookACall",
  "Cloud Status": "cloudStatus",
  "v4 Beta Toggle": "v4BetaToggle",
};

export function useLayoutMetadata(
  activePathName: string | undefined,
  _navigation: NavigationItem[],
) {
  const { region } = useLangfuseCloudRegion();
  const t = useTranslations("navigation.routes");

  return useMemo(() => {
    const basePath = env.NEXT_PUBLIC_BASE_PATH ?? "";

    const translatedName = activePathName
      ? TITLE_TO_KEY[activePathName]
        ? t(TITLE_TO_KEY[activePathName])
        : activePathName
      : undefined;
    const title = translatedName ? `${translatedName} | Langfuse` : "Langfuse";

    // Use dev favicon in DEV region for visual distinction
    // Using SVG for modern browsers with PNG fallback specified in sizes
    const faviconPath =
      region === "DEV" ? `${basePath}/icon-dev.svg` : `${basePath}/icon.svg`;

    return {
      title,
      faviconPath,
      // PNG icons with sizes for broader browser compatibility
      favicon256Path: `${basePath}/icon256.png`,
      appleTouchIconPath: `${basePath}/apple-touch-icon.png`,
    };
  }, [activePathName, region, t]);
}
