import Header from "@/src/components/layouts/header";
import ModelTable from "@/src/components/table/use-cases/models";
import { useTranslations } from "next-intl";

export function ModelsSettings(props: { projectId: string }) {
  const t = useTranslations("models");

  return (
    <>
      <Header title={t("definitions.title")} />
      <p className="mb-2 text-sm">{t("definitions.description")}</p>
      <ModelTable projectId={props.projectId} />
    </>
  );
}
