import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "@/src/utils/api";
import { usePostHogClientCapture } from "@/src/features/posthog-analytics/usePostHogClientCapture";
import ContainerPage from "@/src/components/layouts/container-page";
import { ActionButton } from "@/src/components/ActionButton";
import { SubHeader } from "@/src/components/layouts/header";
import { Button } from "@/src/components/ui/button";
import { ApiKeyRender } from "@/src/features/public-api/components/CreateApiKeyButton";
import { type RouterOutput } from "@/src/utils/types";
import { useState } from "react";
import { useQueryProject } from "@/src/features/projects/hooks";
import { useTranslations } from "next-intl";

export const TracingSetup = ({
  projectId,
  hasTracingConfigured,
}: {
  projectId: string;
  hasTracingConfigured?: boolean;
}) => {
  const t = useTranslations("traces");
  const [apiKeys, setApiKeys] = useState<
    RouterOutput["projectApiKeys"]["create"] | null
  >(null);
  const utils = api.useUtils();
  const mutCreateApiKey = api.projectApiKeys.create.useMutation({
    onSuccess: (data) => {
      utils.projectApiKeys.invalidate();
      setApiKeys(data);
    },
  });

  const createApiKey = async () => {
    try {
      await mutCreateApiKey.mutateAsync({ projectId });
    } catch (error) {
      console.error("Error creating API key:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <SubHeader title={t("setup.step1Title")} />
        {apiKeys ? (
          <ApiKeyRender
            generatedKeys={apiKeys}
            scope={"project"}
            className="mt-4"
          />
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              {t("setup.step1Description")}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={createApiKey}
                loading={mutCreateApiKey.isPending}
                className="self-start"
              >
                {t("setup.createApiKey")}
              </Button>
              <ActionButton
                href={`/project/${projectId}/settings/api-keys`}
                variant="secondary"
              >
                {t("setup.manageApiKeys")}
              </ActionButton>
            </div>
          </div>
        )}
      </div>

      <div>
        <SubHeader
          title={t("setup.step2Title")}
          status={hasTracingConfigured ? "active" : "pending"}
        />
        <p className="mb-4 text-sm text-muted-foreground">
          {t("setup.step2Description")}
        </p>
        <ActionButton href="https://langfuse.com/docs/observability/get-started">
          {t("setup.quickstartGuide")}
        </ActionButton>
      </div>
    </div>
  );
};

export default function TracesSetupPage() {
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const { project } = useQueryProject();
  const t = useTranslations("traces");

  // Check if the user has tracing configured
  // Skip polling entirely if the project flag is already set in the session
  const { data: hasTracingConfigured } =
    api.traces.hasTracingConfigured.useQuery(
      { projectId },
      {
        enabled: !!projectId,
        refetchInterval: project?.hasTraces ? false : 5000,
        initialData: project?.hasTraces ? true : undefined,
        staleTime: project?.hasTraces ? Infinity : 0,
        trpc: {
          context: {
            skipBatch: true,
          },
        },
      },
    );

  const capture = usePostHogClientCapture();
  useEffect(() => {
    if (hasTracingConfigured !== undefined) {
      capture("onboarding:tracing_check_active", {
        active: hasTracingConfigured,
      });
    }
  }, [hasTracingConfigured, capture]);

  return (
    <ContainerPage
      headerProps={{
        title: t("pages.tracingSetupTitle"),
        help: {
          description: t("pages.tracingSetupHelp"),
          href: "https://langfuse.com/docs/observability/overview",
        },
      }}
    >
      <div className="flex flex-col gap-4">
        <TracingSetup
          projectId={projectId}
          hasTracingConfigured={hasTracingConfigured ?? false}
        />
      </div>
    </ContainerPage>
  );
}
