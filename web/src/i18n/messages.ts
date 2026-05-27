import enCommon from "@/messages/en/common.json";
import enNavigation from "@/messages/en/navigation.json";
import enOverview from "@/messages/en/overview.json";
import enTraces from "@/messages/en/traces.json";
import enDashboard from "@/messages/en/dashboard.json";
import enSettings from "@/messages/en/settings.json";
import enPrompts from "@/messages/en/prompts.json";
import enPlayground from "@/messages/en/playground.json";
import enDatasets from "@/messages/en/datasets.json";
import enScores from "@/messages/en/scores.json";
import enSessions from "@/messages/en/sessions.json";
import enModels from "@/messages/en/models.json";
import enAuth from "@/messages/en/auth.json";

import esCommon from "@/messages/es/common.json";
import esNavigation from "@/messages/es/navigation.json";
import esOverview from "@/messages/es/overview.json";
import esTraces from "@/messages/es/traces.json";
import esDashboard from "@/messages/es/dashboard.json";
import esSettings from "@/messages/es/settings.json";
import esPrompts from "@/messages/es/prompts.json";
import esPlayground from "@/messages/es/playground.json";
import esDatasets from "@/messages/es/datasets.json";
import esScores from "@/messages/es/scores.json";
import esSessions from "@/messages/es/sessions.json";
import esModels from "@/messages/es/models.json";
import esAuth from "@/messages/es/auth.json";

export const allMessages: Record<string, Record<string, unknown>> = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    overview: enOverview,
    traces: enTraces,
    dashboard: enDashboard,
    settings: enSettings,
    prompts: enPrompts,
    playground: enPlayground,
    datasets: enDatasets,
    scores: enScores,
    sessions: enSessions,
    models: enModels,
    auth: enAuth,
  },
  es: {
    common: esCommon,
    navigation: esNavigation,
    overview: esOverview,
    traces: esTraces,
    dashboard: esDashboard,
    settings: esSettings,
    prompts: esPrompts,
    playground: esPlayground,
    datasets: esDatasets,
    scores: esScores,
    sessions: esSessions,
    models: esModels,
    auth: esAuth,
  },
};
