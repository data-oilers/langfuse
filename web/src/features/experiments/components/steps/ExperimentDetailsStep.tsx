import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { type ExperimentDetailsStepProps } from "@/src/features/experiments/types/stepProps";
import { StepHeader } from "@/src/features/experiments/components/shared/StepHeader";
import { useTranslations } from "next-intl";

export const ExperimentDetailsStep: React.FC<ExperimentDetailsStepProps> = ({
  formState,
}) => {
  const t = useTranslations("datasets");
  const { form } = formState;
  return (
    <div className="space-y-6">
      <StepHeader
        title={t("detailsStep.title")}
        description={t("detailsStep.description")}
      />

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("detailsStep.experimentName")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder={t("detailsStep.experimentNamePlaceholder")}
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("detailsStep.descriptionOptional")}</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder={t("detailsStep.descriptionPlaceholder")}
                className="min-h-[100px] w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
