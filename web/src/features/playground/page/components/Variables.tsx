import { Separator } from "@/src/components/ui/separator";
import { useTranslations } from "next-intl";
import { usePlaygroundContext } from "../context";
import { PromptVariableComponent } from "./PromptVariableComponent";

export const Variables = () => {
  const t = useTranslations("playground");
  const { promptVariables } = usePlaygroundContext();

  const renderNoVariables = () => (
    <div className="text-xs">
      <p className="mb-2">{t("messages.noVariablesDefined")}</p>
      <p>
        {t("messages.variablesHint")} &#123;&#123;exampleVariable&#125;&#125;
      </p>
    </div>
  );

  const renderVariables = () => (
    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
      {promptVariables
        .slice()
        .sort((a, b) => {
          if (a.isUsed && !b.isUsed) return -1;
          if (!a.isUsed && b.isUsed) return 1;
          return a.name.localeCompare(b.name);
        })
        .map((promptVariable, index) => (
          <div key={promptVariable.name}>
            <PromptVariableComponent promptVariable={promptVariable} />
            {index !== promptVariables.length - 1 && (
              <Separator className="my-2" />
            )}
          </div>
        ))}
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      {promptVariables.length === 0 ? renderNoVariables() : renderVariables()}
    </div>
  );
};
