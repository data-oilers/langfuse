import { LifeBuoy } from "lucide-react";
import { useTranslations } from "next-intl";
import { SidebarMenuButton, useSidebar } from "@/src/components/ui/sidebar";
import { useSupportDrawer } from "@/src/features/support-chat/SupportDrawerProvider";

export const SupportButton = () => {
  const { setOpen: setSupportDrawerOpen } = useSupportDrawer();
  const { isMobile, setOpenMobile: setOpenMobileSidebar } = useSidebar();
  const t = useTranslations("navigation.routes");

  return (
    <SidebarMenuButton
      onClick={() => {
        if (isMobile) {
          setOpenMobileSidebar(false);
        }
        setTimeout(() => {
          // push to next tick to avoid flickering when hiding sidebar on mobile
          setSupportDrawerOpen(true);
        }, 1);
      }}
    >
      <LifeBuoy className="h-4 w-4" />
      {t("support")}
    </SidebarMenuButton>
  );
};
