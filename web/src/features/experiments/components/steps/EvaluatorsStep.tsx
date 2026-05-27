import React from "react";
import { FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { TemplateSelector } from "@/src/features/evals/components/template-selector";
import { EvaluatorForm } from "@/src/features/evals/components/evaluator-form";
import { type EvaluatorsStepProps } from "@/src/features/experiments/types/stepProps";
import { StepHeader } from "@/src/features/experiments/components/shared/StepHeader";

export const EvaluatorsStep: React.FC<EvaluatorsStepProps> = ({
  projectId,
  datasetId,
  evaluatorState,
  permissions,
}) => {
  const t = useTranslations("datasets");
  const {
    evalTemplates,
    activeEvaluators,
    pausedEvaluators,
    evaluatorTargetObjects,
    selectedEvaluatorData,
    showEvaluatorForm,
    handleConfigureEvaluator,
    handleSelectEvaluator,
    handleCloseEvaluatorForm,
    handleEvaluatorSuccess,
    handleEvaluatorToggled,
    preprocessFormValues,
  } = evaluatorState;
  const { hasEvalReadAccess, hasEvalWriteAccess } = permissions;
  return (
    <div className="space-y-6">
      <StepHeader
        title={t("evaluatorsStep.title")}
        description={t("evaluatorsStep.description")}
      />

      <FormItem>
        <FormLabel>{t("evaluatorsStep.selectEvaluators")}</FormLabel>
        {hasEvalReadAccess && datasetId ? (
          <TemplateSelector
            projectId={projectId}
            datasetId={datasetId}
            evalTemplates={evalTemplates}
            onConfigureTemplate={handleConfigureEvaluator}
            onSelectEvaluator={handleSelectEvaluator}
            onEvaluatorToggled={handleEvaluatorToggled}
            activeTemplateIds={activeEvaluators}
            inactiveTemplateIds={pausedEvaluators}
            evaluatorTargetObjects={evaluatorTargetObjects}
            disabled={!hasEvalWriteAccess}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            {!hasEvalReadAccess
              ? t("evaluatorsStep.noPermission")
              : t("evaluatorsStep.selectDatasetFirst")}
          </p>
        )}
        <FormMessage />
      </FormItem>

      {/* Dialog for configuring evaluators */}
      {selectedEvaluatorData && (
        <Dialog
          open={showEvaluatorForm}
          onOpenChange={(open) => {
            if (!open) {
              handleCloseEvaluatorForm();
            }
          }}
        >
          <DialogContent className="max-h-[90vh] max-w-screen-md overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedEvaluatorData.evaluator.id
                  ? t("evaluatorsStep.editEvaluator")
                  : t("evaluatorsStep.configureEvaluator")}
              </DialogTitle>
            </DialogHeader>
            <EvaluatorForm
              useDialog={true}
              projectId={projectId}
              evalTemplates={evalTemplates}
              templateId={selectedEvaluatorData.templateId}
              existingEvaluator={selectedEvaluatorData.evaluator}
              mode={selectedEvaluatorData.evaluator.id ? "edit" : "create"}
              hideTargetSection={!selectedEvaluatorData.evaluator.id}
              onFormSuccess={handleEvaluatorSuccess}
              preprocessFormValues={preprocessFormValues}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
