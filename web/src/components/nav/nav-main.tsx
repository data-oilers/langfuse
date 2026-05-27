"use client";
import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar";
import Link from "next/link";
import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/src/utils/tailwind";
import { type RouteGroup } from "@/src/components/layouts/routes";

const TITLE_TO_KEY: Record<string, string> = {
  "Go to...": "goTo",
  Organizations: "organizations",
  Projects: "projects",
  Home: "home",
  Dashboards: "dashboards",
  Tracing: "tracing",
  Sessions: "sessions",
  Users: "users",
  Prompts: "prompts",
  Playground: "playground",
  Scores: "scores",
  "LLM-as-a-Judge": "llmAsJudge",
  "Human Annotation": "humanAnnotation",
  Datasets: "datasets",
  Upgrade: "upgrade",
  Settings: "settings",
  Support: "support",
  "Book a call": "bookACall",
  "Cloud Status": "cloudStatus",
  "v4 Beta Toggle": "v4BetaToggle",
};

export type NavMainItem = {
  title: string;
  menuNode?: ReactNode;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  label?: string | ReactNode;
  newTab?: boolean;
  items?: {
    title: string;
    url: string;
    isActive?: boolean;
    newTab?: boolean;
  }[];
};

function NavItemContent({
  item,
  translatedTitle,
}: {
  item: NavMainItem;
  translatedTitle: string;
}) {
  return (
    <>
      {item.icon && <item.icon />}
      <span>{translatedTitle}</span>
      {item.label &&
        (typeof item.label === "string" ? (
          <span
            className={cn(
              "-my-0.5 self-center whitespace-nowrap break-keep rounded-sm border px-1 py-0.5 text-xs leading-none",
            )}
          >
            {item.label}
          </span>
        ) : (
          // ReactNode
          item.label
        ))}
    </>
  );
}

export function NavMain({
  items,
}: {
  items: {
    grouped: Partial<Record<RouteGroup, NavMainItem[]>> | null;
    ungrouped: NavMainItem[];
  };
}) {
  const tRoutes = useTranslations("navigation.routes");
  const tGroups = useTranslations("navigation.groups");

  const translateTitle = (title: string) => {
    const key = TITLE_TO_KEY[title];
    return key ? tRoutes(key) : title;
  };

  const translateGroup = (group: string) => {
    try {
      return tGroups(group);
    } catch {
      return group;
    }
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.ungrouped.map((item) => {
              const translated = translateTitle(item.title);
              return (
                <SidebarMenuItem key={item.title}>
                  {item.menuNode || (
                    <SidebarMenuButton
                      asChild
                      tooltip={translated}
                      isActive={item.isActive}
                    >
                      <Link
                        href={item.url}
                        target={item.newTab ? "_blank" : undefined}
                      >
                        <NavItemContent
                          item={item}
                          translatedTitle={translated}
                        />
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      {items.grouped &&
        Object.entries(items.grouped).map(([group, items]) => (
          <SidebarGroup key={group}>
            <SidebarGroupLabel>{translateGroup(group)}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const translated = translateTitle(item.title);
                  return (
                    <SidebarMenuItem key={item.title}>
                      {item.menuNode || (
                        <SidebarMenuButton
                          asChild
                          tooltip={translated}
                          isActive={item.isActive}
                        >
                          <Link
                            href={item.url}
                            target={item.newTab ? "_blank" : undefined}
                          >
                            <NavItemContent
                              item={item}
                              translatedTitle={translated}
                            />
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
    </>
  );
}
