import { PlusCircle, Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import type { FormUpsertModel } from "../../validation";
import { useTranslations } from "next-intl";

type TierConditionsEditorProps = {
  tierIndex: number;
  form: UseFormReturn<FormUpsertModel>;
};

export type { TierConditionsEditorProps };

export function TierConditionsEditor({
  tierIndex,
  form,
}: TierConditionsEditorProps) {
  const t = useTranslations("models");
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `pricingTiers.${tierIndex}.conditions`,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FormLabel>{t("pricing.conditions")}</FormLabel>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            append({
              usageDetailPattern: "",
              operator: "gt",
              value: 0,
              caseSensitive: false,
            })
          }
        >
          <PlusCircle className="mr-1 h-4 w-4" />
          {t("pricing.addCondition")}
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {t("pricing.conditionWarning")}
        </div>
      )}

      {fields.map((condition, conditionIndex) => (
        <div key={condition.id} className="space-y-3 rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {t("pricing.conditionNumber", { number: conditionIndex + 1 })}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(conditionIndex)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Pattern */}
          <FormField
            control={form.control}
            name={`pricingTiers.${tierIndex}.conditions.${conditionIndex}.usageDetailPattern`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("pricing.usageDetailPattern")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="^input" />
                </FormControl>
                <FormDescription>
                  {t("pricing.usageDetailPatternDescription")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Operator + Value */}
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name={`pricingTiers.${tierIndex}.conditions.${conditionIndex}.operator`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pricing.operator")}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gt">&gt; (greater than)</SelectItem>
                      <SelectItem value="gte">
                        &gt;= (greater or equal)
                      </SelectItem>
                      <SelectItem value="lt">&lt; (less than)</SelectItem>
                      <SelectItem value="lte">&lt;= (less or equal)</SelectItem>
                      <SelectItem value="eq">= (equals)</SelectItem>
                      <SelectItem value="neq">!= (not equals)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`pricingTiers.${tierIndex}.conditions.${conditionIndex}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pricing.value")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Case Sensitive */}
          <FormField
            control={form.control}
            name={`pricingTiers.${tierIndex}.conditions.${conditionIndex}.caseSensitive`}
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">
                  {t("pricing.caseSensitive")}
                </FormLabel>
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
}
