"use client";

import { useCallback, useEffect, useState } from "react";
import { imageAssets } from "@/src/data/assets";
import type { MatchEvent, MatchItem, MatchLineupGroup, MatchStat } from "@/src/data/matches";
import type { NewsArticle, NewsCategory, TransferItem } from "@/src/data/news";

const STORAGE_KEY = "viola-community-content-v1";

export type LocalContent = {
  articles: NewsArticle[];
  transfers: TransferItem[];
  matches: MatchItem[];
  home: LocalHomeContent;
  settings: LocalSettings;
};

export type LocalMediaCard = {
  eyebrow: string;
  title: string;
  image: string;
};

export type LocalHomeContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroText: string;
  mediaCards: LocalMediaCard[];
  fanEyebrow: string;
  fanTitle: string;
  fanText: string;
  fanImage: string;
  footerTitle: string;
  footerText: string;
  footerStatusText: string;
};

export type LocalSettings = {
  telegramUrl: string;
  partnerTitle: string;
  partnerText: string;
  partnerButtonLabel: string;
  partnerHref: string;
};

export const defaultLocalHome: LocalHomeContent = {
  heroEyebrow: "Русскоязычный фан-портал / ACF Fiorentina",
  heroTitle: "Viola\nCommunity",
  heroText:
    "Новости, трансферы, календарь матчей и живое обсуждение Fiorentina в одном аккуратном портале для болельщиков.",
  mediaCards: [
    {
      eyebrow: "Curva",
      title: "Флаги, голоса и цвет",
      image: imageAssets.fansFlags,
    },
    {
      eyebrow: "Player",
      title: "Герои матча крупным планом",
      image: imageAssets.playerMain,
    },
    {
      eyebrow: "Team",
      title: "Команда, форма и сезон",
      image: imageAssets.kitGroup,
    },
  ],
  fanEyebrow: "Curva energy",
  fanTitle: "Фан-зона и Telegram",
  fanText:
    "Портал ведёт людей к новостям, матчам и обсуждению в Telegram. Всё важное для болельщика собрано рядом: лента, календарь и живое обсуждение.",
  fanImage: imageAssets.fansFlags,
  footerTitle: "Русскоязычный фан-портал ACF Fiorentina",
  footerText:
    "Новости, трансферы, календарь матчей и материалы сообщества в одном аккуратном пространстве для болельщиков Fiorentina.",
  footerStatusText: "Календарь, новости и трансферы обновляются через админку.",
};

export const defaultLocalSettings: LocalSettings = {
  telegramUrl: "https://t.me/acf_fiorentina_rus",
  partnerTitle: "Реклама на Viola Community",
  partnerText: "Нативный блок для партнёров, которые хотят попасть в футбольную и фанатскую аудиторию.",
  partnerButtonLabel: "Партнёрам",
  partnerHref: "/partners",
};

const emptyContent: LocalContent = {
  articles: [],
  transfers: [],
  matches: [],
  home: defaultLocalHome,
  settings: defaultLocalSettings,
};

const articleCategories: Array<Exclude<NewsCategory, "all">> = [
  "matches",
  "transfers",
  "team",
  "history",
  "community",
];

const transferStatuses: TransferItem["status"][] = ["interest", "rumor", "talks", "signed", "exit"];
const transferReliability: TransferItem["reliability"][] = ["низкая", "средняя", "высокая"];

export function getArticleHref(article: NewsArticle) {
  return article.localDraft || article.slug.startsWith("local-") || article.author === "Viola admin"
    ? `/news/custom?slug=${encodeURIComponent(article.slug)}`
    : `/news/${article.slug}`;
}

export function mergeArticles(localArticles: NewsArticle[], baseArticles: NewsArticle[]) {
  const localSlugs = new Set(localArticles.map((article) => article.slug));

  return [
    ...localArticles,
    ...baseArticles.filter((article) => !localSlugs.has(article.slug)),
  ];
}

export function mergeTransfers(localTransfers: TransferItem[], baseTransfers: TransferItem[]) {
  const localPlayers = new Set(localTransfers.map((item) => item.player));

  return [
    ...localTransfers,
    ...baseTransfers.filter((item) => !localPlayers.has(item.player)),
  ];
}

export function mergeMatches(localMatches: MatchItem[], baseMatches: MatchItem[]) {
  const localSlugs = new Set(localMatches.map((match) => match.slug));

  return [
    ...localMatches,
    ...baseMatches.filter((match) => !localSlugs.has(match.slug)),
  ];
}

export function getMatchHref(match: MatchItem) {
  return match.localDraft || match.slug.startsWith("local-")
    ? `/matches/custom?slug=${encodeURIComponent(match.slug)}`
    : `/matches/${match.slug}`;
}

export function createArticleSlug(title: string) {
  const normalized = title
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return normalized ? `local-${normalized}` : `local-${Date.now()}`;
}

export function createMatchSlug(homeTeam: string, awayTeam: string, kickoff: string) {
  const normalized = `${homeTeam}-${awayTeam}-${kickoff}`
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return normalized ? `local-${normalized}` : `local-match-${Date.now()}`;
}

export function readLocalContent(): LocalContent {
  if (typeof window === "undefined") {
    return emptyContent;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyContent;
    }

    return normalizeContent(JSON.parse(raw));
  } catch {
    return emptyContent;
  }
}

export function writeLocalContent(content: LocalContent) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  window.dispatchEvent(new Event("viola-content-updated"));
}

export function useLocalContent() {
  const [content, setContent] = useState<LocalContent>(emptyContent);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const load = () => {
      setContent(readLocalContent());
      setHydrated(true);
    };

    load();
    window.addEventListener("storage", load);
    window.addEventListener("viola-content-updated", load);

    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("viola-content-updated", load);
    };
  }, []);

  const saveContent = useCallback((nextContent: LocalContent) => {
    writeLocalContent(nextContent);
    setContent(nextContent);
  }, []);

  return {
    ...content,
    hydrated,
    saveContent,
  };
}

function normalizeContent(value: unknown): LocalContent {
  if (!isRecord(value)) {
    return emptyContent;
  }

  return {
    articles: Array.isArray(value.articles)
      ? value.articles.map(normalizeArticle).filter((item): item is NewsArticle => Boolean(item))
      : [],
    transfers: Array.isArray(value.transfers)
      ? value.transfers.map(normalizeTransfer).filter((item): item is TransferItem => Boolean(item))
      : [],
    matches: Array.isArray(value.matches)
      ? value.matches.map(normalizeMatch).filter((item): item is MatchItem => Boolean(item))
      : [],
    home: normalizeHome(value.home),
    settings: normalizeSettings(value.settings),
  };
}

function normalizeHome(value: unknown): LocalHomeContent {
  if (!isRecord(value)) {
    return defaultLocalHome;
  }

  const mediaCards = Array.isArray(value.mediaCards)
    ? value.mediaCards.map(normalizeMediaCard).filter((item): item is LocalMediaCard => Boolean(item))
    : [];

  return {
    heroEyebrow: readString(value.heroEyebrow) || defaultLocalHome.heroEyebrow,
    heroTitle: readString(value.heroTitle) || defaultLocalHome.heroTitle,
    heroText: readString(value.heroText) || defaultLocalHome.heroText,
    mediaCards: [0, 1, 2].map((index) => mediaCards[index] ?? defaultLocalHome.mediaCards[index]),
    fanEyebrow: readString(value.fanEyebrow) || defaultLocalHome.fanEyebrow,
    fanTitle: readString(value.fanTitle) || defaultLocalHome.fanTitle,
    fanText: readString(value.fanText) || defaultLocalHome.fanText,
    fanImage: readString(value.fanImage) || defaultLocalHome.fanImage,
    footerTitle: readString(value.footerTitle) || defaultLocalHome.footerTitle,
    footerText: readString(value.footerText) || defaultLocalHome.footerText,
    footerStatusText: readString(value.footerStatusText) || defaultLocalHome.footerStatusText,
  };
}

function normalizeMediaCard(value: unknown): LocalMediaCard | null {
  if (!isRecord(value)) {
    return null;
  }

  const title = readString(value.title);

  if (!title) {
    return null;
  }

  return {
    eyebrow: readString(value.eyebrow) || "Viola",
    title,
    image: readString(value.image) || imageAssets.fansFlags,
  };
}

function normalizeSettings(value: unknown): LocalSettings {
  if (!isRecord(value)) {
    return defaultLocalSettings;
  }

  return {
    telegramUrl: readString(value.telegramUrl) || defaultLocalSettings.telegramUrl,
    partnerTitle: readString(value.partnerTitle) || defaultLocalSettings.partnerTitle,
    partnerText: readString(value.partnerText) || defaultLocalSettings.partnerText,
    partnerButtonLabel: readString(value.partnerButtonLabel) || defaultLocalSettings.partnerButtonLabel,
    partnerHref: readString(value.partnerHref) || defaultLocalSettings.partnerHref,
  };
}

function normalizeArticle(value: unknown): NewsArticle | null {
  if (!isRecord(value)) {
    return null;
  }

  const category = String(value.category);
  if (!articleCategories.includes(category as Exclude<NewsCategory, "all">)) {
    return null;
  }

  const title = readString(value.title);
  const slug = readString(value.slug);
  const excerpt = readString(value.excerpt);

  if (!title || !slug || !excerpt) {
    return null;
  }

  return {
    slug,
    title,
    excerpt,
    category: category as Exclude<NewsCategory, "all">,
    author: readString(value.author) || "Viola admin",
    publishedAt: readString(value.publishedAt) || "Сегодня",
    readTime: readString(value.readTime) || "3 мин",
    views: readString(value.views) || "Admin",
    coverImage: readString(value.coverImage) || "/images/stadium-franchi-aerial.jpg",
    sourceLabel: readString(value.sourceLabel) || undefined,
    sourceUrl: readString(value.sourceUrl) || undefined,
    featured: Boolean(value.featured),
    localDraft: Boolean(value.localDraft),
    body: Array.isArray(value.body)
      ? value.body.map(String).filter(Boolean)
      : [excerpt],
    relatedSlugs: Array.isArray(value.relatedSlugs)
      ? value.relatedSlugs.map(String).filter(Boolean)
      : [],
  };
}

function normalizeTransfer(value: unknown): TransferItem | null {
  if (!isRecord(value)) {
    return null;
  }

  const status = String(value.status);
  const reliability = String(value.reliability);
  const player = readString(value.player);

  if (
    !player ||
    !transferStatuses.includes(status as TransferItem["status"]) ||
    !transferReliability.includes(reliability as TransferItem["reliability"])
  ) {
    return null;
  }

  return {
    player,
    position: readString(value.position) || "Позиция уточняется",
    status: status as TransferItem["status"],
    reliability: reliability as TransferItem["reliability"],
    updatedAt: readString(value.updatedAt) || "Сегодня",
    summary: readString(value.summary) || "Короткая заметка для трансферного радара.",
    coverImage: readString(value.coverImage) || undefined,
  };
}

function normalizeMatch(value: unknown): MatchItem | null {
  if (!isRecord(value)) {
    return null;
  }

  const slug = readString(value.slug);
  const homeTeam = readString(value.homeTeam);
  const awayTeam = readString(value.awayTeam);
  const kickoff = readString(value.kickoff);
  const status = readString(value.status);

  if (!slug || !homeTeam || !awayTeam || !kickoff || !["upcoming", "finished"].includes(status)) {
    return null;
  }

  const competition = readString(value.competition) || "Serie A";
  const round = readString(value.round) || "Матч";
  const venue = readString(value.venue) || "Stadio Artemio Franchi";
  const score = readString(value.score);
  const headline =
    readString(value.headline) || `${homeTeam} vs ${awayTeam}: матч в календаре Fiorentina`;
  const summary =
    readString(value.summary) ||
    `${round}. ${kickoff}. ${venue}. Матч добавлен через локальную админку Viola Community.`;

  return {
    slug,
    homeTeam,
    awayTeam,
    competition,
    round,
    kickoff,
    venue,
    status: status as MatchItem["status"],
    score: score || undefined,
    resultLabel:
      readString(value.resultLabel) || (status === "finished" ? "Результат" : "До матча"),
    headline,
    summary,
    coverImage: readString(value.coverImage) || imageAssets.stadium,
    countdown: Array.isArray(value.countdown) ? value.countdown.map(String).filter(Boolean) : [],
    form: Array.isArray(value.form) ? value.form.map(String).filter(Boolean).slice(0, 5) : [],
    events: Array.isArray(value.events)
      ? value.events.map(normalizeEvent).filter((item): item is MatchEvent => Boolean(item))
      : [],
    stats: Array.isArray(value.stats)
      ? value.stats.map(normalizeStat).filter((item): item is MatchStat => Boolean(item))
      : [],
    lineup: Array.isArray(value.lineup)
      ? value.lineup.map(normalizeLineupGroup).filter((item): item is MatchLineupGroup => Boolean(item))
      : [],
    localDraft: Boolean(value.localDraft),
  };
}

function normalizeEvent(value: unknown): MatchEvent | null {
  if (!isRecord(value)) {
    return null;
  }

  const type = readString(value.type);
  if (!["goal", "card", "substitution", "note"].includes(type)) {
    return null;
  }

  return {
    minute: readString(value.minute) || "-",
    team: readString(value.team) || "Viola",
    type: type as MatchEvent["type"],
    text: readString(value.text) || "Событие матча",
  };
}

function normalizeStat(value: unknown): MatchStat | null {
  if (!isRecord(value)) {
    return null;
  }

  const label = readString(value.label);
  if (!label) {
    return null;
  }

  return {
    label,
    home: readNumber(value.home),
    away: readNumber(value.away),
    suffix: readString(value.suffix) || undefined,
  };
}

function normalizeLineupGroup(value: unknown): MatchLineupGroup | null {
  if (!isRecord(value)) {
    return null;
  }

  const title = readString(value.title);
  if (!title) {
    return null;
  }

  return {
    title,
    players: Array.isArray(value.players) ? value.players.map(String).filter(Boolean) : [],
  };
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
