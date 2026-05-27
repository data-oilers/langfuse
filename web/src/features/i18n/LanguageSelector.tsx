import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { cn } from "@/src/utils/tailwind";

const languages = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
] as const;

export function LanguageSelector() {
  const router = useRouter();
  const t = useTranslations("common");
  const currentLocale = router.locale ?? "en";

  const switchLocale = (locale: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
    router.replace(router.asPath, undefined, { locale });
  };

  return (
    <div className="flex items-center space-x-1">
      <span className="mr-2">{t("userMenu.language")}</span>
      {languages.map((lang) => (
        <div key={lang.code} title={lang.code === "en" ? "English" : "Español"}>
          <span
            className={cn(
              currentLocale === lang.code
                ? "font-semibold text-primary-accent"
                : "",
              "cursor-pointer rounded-sm px-1.5 py-0.5 text-xs hover:bg-input hover:text-primary-accent",
            )}
            onClick={switchLocale(lang.code)}
          >
            {lang.label}
          </span>
        </div>
      ))}
    </div>
  );
}
