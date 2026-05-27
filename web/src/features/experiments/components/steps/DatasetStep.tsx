import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/src/components/ui/form";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Info, CircleCheck } from "lucide-react";
import { type DatasetStepProps } from "@/src/features/experiments/types/stepProps";
import { StepHeader } from "@/src/features/experiments/components/shared/StepHeader";
import { api } from "@/src/utils/api";
import { format } from "date-fns";

export const DatasetStep: React.FC<DatasetStepProps> = ({
  projectId,
  formState,
  datasetState,
  promptInfo,
}) => {
  const t = useTranslations("datasets");
  const { form } = formState;
  const {
    datasets,
    selectedDatasetId,
    expectedColumnsForDataset: expectedColumns,
    validationResult,
  } = datasetState;
  const { selectedPromptName, selectedPromptVersion } = promptInfo;

  // Fetch dataset versions when a dataset is selected
  const { data: datasetVersions } = api.datasets.listDatasetVersions.useQuery(
    {
      projectId,
      datasetId: selectedDatasetId || "",
    },
    {
      enabled: !!selectedDatasetId,
    },
  );

  return (
    <div className="space-y-6">
      <StepHeader
        title={t("datasetStep.title")}
        description={t("datasetStep.description")}
      />

      <FormField
        control={form.control}
        name="datasetId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("datasetStep.dataset")}</FormLabel>
            <div className="flex items-center gap-2">
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder={t("datasetStep.selectDataset")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(datasets ?? []).map((dataset) => (
                    <SelectItem key={dataset.id} value={dataset.id}>
                      {dataset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedPromptName && selectedPromptVersion !== null && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-8">
                      {t("datasetStep.expectedColumns")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">
                        {t("datasetStep.expectedDatasetStructure")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t("datasetStep.basedOnPrompt", {
                          name: selectedPromptName,
                          version: String(selectedPromptVersion),
                        })}
                      </p>
                      <div className="space-y-1 pt-2">
                        <p className="text-sm font-medium">
                          {t("datasetStep.inputVariables")}
                        </p>
                        <ul className="list-inside list-disc text-sm">
                          {expectedColumns.inputVariables.map((variable) => (
                            <li key={variable}>{variable}</li>
                          ))}
                        </ul>
                        <p className="text-sm font-medium">
                          {t("datasetStep.expectedOutput")}
                        </p>
                        <ul className="list-inside list-disc text-sm">
                          <li>
                            {expectedColumns.outputVariableName} (
                            {expectedColumns.outputVariableType})
                          </li>
                        </ul>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedDatasetId && datasetVersions && datasetVersions.length > 0 && (
        <FormField
          control={form.control}
          name="datasetVersion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("datasetStep.datasetVersionOptional")}</FormLabel>
              <Select
                onValueChange={(value) => {
                  if (value === "latest") {
                    field.onChange(undefined);
                  } else {
                    field.onChange(new Date(value));
                  }
                }}
                value={field.value ? field.value.toISOString() : "latest"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("datasetStep.latestVersion")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="latest">
                    {t("datasetStep.latestVersion")}
                  </SelectItem>
                  {datasetVersions.map((version) => (
                    <SelectItem
                      key={version.toISOString()}
                      value={version.toISOString()}
                    >
                      {format(version, "MMM d, yyyy 'at' h:mm a")} (UTC)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {t("datasetStep.versionDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {selectedDatasetId && (
        <>
          {validationResult?.isValid === false && (
            <Card className="relative overflow-hidden rounded-md border-dark-yellow bg-light-yellow shadow-none group-data-[collapsible=icon]:hidden">
              <CardHeader className="p-2">
                <CardTitle className="flex items-center justify-between text-sm text-dark-yellow">
                  <span>{t("datasetStep.invalidConfiguration")}</span>
                  <Info className="h-4 w-4" />
                </CardTitle>
                <CardDescription className="text-foreground">
                  {validationResult?.message}
                </CardDescription>
              </CardHeader>
            </Card>
          )}
          {validationResult?.isValid === true && (
            <Card className="relative overflow-hidden rounded-md border-dark-green bg-light-green shadow-none group-data-[collapsible=icon]:hidden">
              <CardHeader className="p-2">
                <CardTitle className="flex items-center justify-between text-sm text-dark-green">
                  <span>{t("datasetStep.validConfiguration")}</span>
                  <CircleCheck className="h-4 w-4" />
                </CardTitle>
                <div className="text-sm">
                  {t("datasetStep.matchesBetweenItems")}
                  <ul className="my-2 ml-2 list-inside list-disc">
                    {Object.entries(validationResult.variablesMap ?? {}).map(
                      ([variable, count]) => (
                        <li key={variable}>
                          <strong>{variable}:</strong> {count} /{" "}
                          {validationResult?.isValid
                            ? validationResult.totalItems
                            : "unknown"}
                        </li>
                      ),
                    )}
                  </ul>
                  {t("datasetStep.itemsMissingVariables")}
                </div>
              </CardHeader>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
