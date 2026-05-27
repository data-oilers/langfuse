import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

type NoMatchDisplayProps = {
  modelName: string;
};

export type { NoMatchDisplayProps };

export function NoMatchDisplay({ modelName }: NoMatchDisplayProps) {
  const t = useTranslations("models");

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-destructive">
          <AlertCircle className="h-5 w-5" />
          {t("testMatch.noMatchFound")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">
          {t("testMatch.noMatchDescription", { modelName })}
        </p>

        <div>
          <p className="mb-2 text-sm font-medium">
            {t("testMatch.noMatchSuggestions")}
          </p>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>{t("testMatch.noMatchSuggestion1")}</li>
            <li>{t("testMatch.noMatchSuggestion2")}</li>
            <li>{t("testMatch.noMatchSuggestion3")}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
