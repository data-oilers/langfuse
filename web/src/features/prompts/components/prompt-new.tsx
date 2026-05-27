import { StringParam, useQueryParam } from "use-query-params";
import { useTranslations } from "next-intl";
import { NewPromptForm } from "@/src/features/prompts/components/NewPromptForm";
import useProjectIdFromURL from "@/src/hooks/useProjectIdFromURL";
import { api } from "@/src/utils/api";
import Page from "@/src/components/layouts/page";

export const NewPrompt = () => {
  const t = useTranslations("prompts");
  const projectId = useProjectIdFromURL();
  const [initialPromptId] = useQueryParam("promptId", StringParam);

  const { data: initialPrompt, isInitialLoading } = api.prompts.byId.useQuery(
    {
      projectId: projectId as string, // Typecast as query is enabled only when projectId is present
      id: initialPromptId ?? "",
    },
    {
      enabled: Boolean(initialPromptId && projectId),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  if (isInitialLoading) {
    return <div className="p-3">{t("detail.loading")}</div>;
  }

  const breadcrumb: { name: string; href?: string }[] = [
    {
      name: t("list.title"),
      href: `/project/${projectId}/prompts/`,
    },
    {
      name: t("editor.createPromptButton"),
    },
  ];

  if (initialPrompt) {
    breadcrumb.pop();
    breadcrumb.push(
      {
        name: initialPrompt.name,
        href: `/project/${projectId}/prompts/${encodeURIComponent(initialPrompt.name)}`,
      },
      { name: t("editor.newVersionTitle") },
    );
  }

  return (
    <Page
      withPadding
      scrollable
      headerProps={{
        title: initialPrompt
          ? `${initialPrompt.name} \u2014 ${t("editor.newVersionTitle")}`
          : t("editor.createPromptButton"),
        help: {
          description: t("detail.helpDescription"),
          href: "https://langfuse.com/docs/prompts",
        },
        breadcrumb: breadcrumb,
      }}
    >
      {initialPrompt ? (
        <p className="text-sm text-muted-foreground">
          {t("detail.immutableNote")}
        </p>
      ) : null}
      <div className="my-8">
        <NewPromptForm {...{ initialPrompt }} />
      </div>
    </Page>
  );
};
