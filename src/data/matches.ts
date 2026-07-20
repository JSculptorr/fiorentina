import { imageAssets } from "@/src/data/assets";

export type MatchStatus = "upcoming" | "finished";
export type MatchFilter = MatchStatus | "all";

export type MatchEvent = {
  minute: string;
  team: string;
  type: "goal" | "card" | "substitution" | "note";
  text: string;
};

export type MatchStat = {
  label: string;
  home: number;
  away: number;
  suffix?: string;
};

export type MatchLineupGroup = {
  title: string;
  players: string[];
};

export type MatchItem = {
  slug: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  round: string;
  kickoff: string;
  venue: string;
  status: MatchStatus;
  score?: string;
  resultLabel: string;
  headline: string;
  summary: string;
  coverImage: string;
  countdown: string[];
  form: string[];
  events: MatchEvent[];
  stats: MatchStat[];
  lineup: MatchLineupGroup[];
  localDraft?: boolean;
};

export const matchStatusLabels: Record<MatchFilter, string> = {
  all: "Все",
  upcoming: "Ближайшие",
  finished: "Результаты",
};

export const matchStatusOrder: MatchFilter[] = ["all", "upcoming", "finished"];

type FixtureSeed = {
  slug: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  round: string;
  kickoff: string;
  venue?: string;
};

const defaultForm = ["D", "W", "D", "W", "D"];
const defaultStats: MatchStat[] = [
  { label: "Владение", home: 50, away: 50, suffix: "%" },
  { label: "Удары", home: 0, away: 0 },
  { label: "Удары в створ", home: 0, away: 0 },
  { label: "Угловые", home: 0, away: 0 },
];
const defaultEvents: MatchEvent[] = [
  {
    minute: "До матча",
    team: "Viola desk",
    type: "note",
    text: "Предматчевый центр соберёт новости состава, ключевые темы и материалы перед игрой.",
  },
];
const defaultLineup: MatchLineupGroup[] = [
  {
    title: "Перед матчем",
    players: ["Превью", "Новости состава", "Материалы перед игрой"],
  },
  {
    title: "После матча",
    players: ["Разбор", "События", "Связанные новости"],
  },
];

const friendlyFixtures: FixtureSeed[] = [
  {
    slug: "fiorentina-fiorentina-u20-2026-07-19",
    homeTeam: "Fiorentina",
    awayTeam: "Fiorentina U20",
    competition: "Товарищеский матч",
    round: "Летняя подготовка",
    kickoff: "19 июля 2026, 18:00",
    venue: "Viola Park",
  },
  {
    slug: "fiorentina-gubbio-2026-07-22",
    homeTeam: "Fiorentina",
    awayTeam: "Gubbio",
    competition: "Товарищеский матч",
    round: "Летняя подготовка",
    kickoff: "22 июля 2026, 19:00",
    venue: "Viola Park",
  },
  {
    slug: "qpr-fiorentina-2026-07-25",
    homeTeam: "QPR",
    awayTeam: "Fiorentina",
    competition: "Товарищеский матч",
    round: "Сборы в Англии",
    kickoff: "25 июля 2026, 16:00",
    venue: "Loftus Road / уточняется",
  },
  {
    slug: "watford-fiorentina-2026-07-29",
    homeTeam: "Watford",
    awayTeam: "Fiorentina",
    competition: "Товарищеский матч",
    round: "Сборы в Англии",
    kickoff: "29 июля 2026, 20:30",
    venue: "Vicarage Road / уточняется",
  },
  {
    slug: "fiorentina-deportivo-2026-08-06",
    homeTeam: "Fiorentina",
    awayTeam: "Deportivo La Coruna",
    competition: "Товарищеский матч",
    round: "Летняя подготовка",
    kickoff: "6 августа 2026, 20:00",
    venue: "Stadio Artemio Franchi / уточняется",
  },
  {
    slug: "modena-fiorentina-2026-08-08",
    homeTeam: "Modena",
    awayTeam: "Fiorentina",
    competition: "Товарищеский матч",
    round: "Летняя подготовка",
    kickoff: "8 августа 2026, 18:00",
    venue: "Стадион уточняется",
  },
];

const serieAFixtures: FixtureSeed[] = [
  ["roma-fiorentina-2026-08-24", "Roma", "Fiorentina", "1 тур", "24 августа 2026, 18:45"],
  ["fiorentina-frosinone-2026-08-29", "Fiorentina", "Frosinone", "2 тур", "29 августа 2026, 16:30"],
  ["fiorentina-torino-2026-09-05", "Fiorentina", "Torino", "3 тур", "5 сентября 2026, 13:00"],
  ["venezia-fiorentina-2026-09-11", "Venezia", "Fiorentina", "4 тур", "11 сентября 2026, 18:45"],
  ["fiorentina-napoli-2026-09-20", "Fiorentina", "Napoli", "5 тур", "20 сентября 2026, 10:30"],
  ["genoa-fiorentina-2026-10-10", "Genoa", "Fiorentina", "6 тур", "10 октября 2026, время уточняется"],
  ["fiorentina-como-2026-10-17", "Fiorentina", "Como", "7 тур", "17 октября 2026, время уточняется"],
  ["inter-fiorentina-2026-10-24", "Inter", "Fiorentina", "8 тур", "24 октября 2026, время уточняется"],
  ["fiorentina-atalanta-2026-10-27", "Fiorentina", "Atalanta", "9 тур", "27 октября 2026, время уточняется"],
  ["sassuolo-fiorentina-2026-10-31", "Sassuolo", "Fiorentina", "10 тур", "31 октября 2026, время уточняется"],
  ["fiorentina-juventus-2026-11-07", "Fiorentina", "Juventus", "11 тур", "7 ноября 2026, время уточняется"],
  ["monza-fiorentina-2026-11-21", "Monza", "Fiorentina", "12 тур", "21 ноября 2026, время уточняется"],
  ["udinese-fiorentina-2026-11-28", "Udinese", "Fiorentina", "13 тур", "28 ноября 2026, время уточняется"],
  ["fiorentina-cagliari-2026-12-05", "Fiorentina", "Cagliari", "14 тур", "5 декабря 2026, время уточняется"],
  ["parma-fiorentina-2026-12-12", "Parma", "Fiorentina", "15 тур", "12 декабря 2026, время уточняется"],
  ["fiorentina-bologna-2026-12-19", "Fiorentina", "Bologna", "16 тур", "19 декабря 2026, время уточняется"],
  ["fiorentina-lazio-2027-01-02", "Fiorentina", "Lazio", "17 тур", "2 января 2027, время уточняется"],
  ["milan-fiorentina-2027-01-05", "Milan", "Fiorentina", "18 тур", "5 января 2027, время уточняется"],
  ["fiorentina-lecce-2027-01-09", "Fiorentina", "Lecce", "19 тур", "9 января 2027, время уточняется"],
  ["napoli-fiorentina-2027-01-16", "Napoli", "Fiorentina", "20 тур", "16 января 2027, время уточняется"],
  ["fiorentina-sassuolo-2027-01-23", "Fiorentina", "Sassuolo", "21 тур", "23 января 2027, время уточняется"],
  ["atalanta-fiorentina-2027-01-30", "Atalanta", "Fiorentina", "22 тур", "30 января 2027, время уточняется"],
  ["fiorentina-udinese-2027-02-06", "Fiorentina", "Udinese", "23 тур", "6 февраля 2027, время уточняется"],
  ["frosinone-fiorentina-2027-02-13", "Frosinone", "Fiorentina", "24 тур", "13 февраля 2027, время уточняется"],
  ["fiorentina-inter-2027-02-20", "Fiorentina", "Inter", "25 тур", "20 февраля 2027, время уточняется"],
  ["torino-fiorentina-2027-02-27", "Torino", "Fiorentina", "26 тур", "27 февраля 2027, время уточняется"],
  ["fiorentina-venezia-2027-03-06", "Fiorentina", "Venezia", "27 тур", "6 марта 2027, время уточняется"],
  ["cagliari-fiorentina-2027-03-13", "Cagliari", "Fiorentina", "28 тур", "13 марта 2027, время уточняется"],
  ["fiorentina-genoa-2027-03-20", "Fiorentina", "Genoa", "29 тур", "20 марта 2027, время уточняется"],
  ["como-fiorentina-2027-04-03", "Como", "Fiorentina", "30 тур", "3 апреля 2027, время уточняется"],
  ["fiorentina-milan-2027-04-10", "Fiorentina", "Milan", "31 тур", "10 апреля 2027, время уточняется"],
  ["fiorentina-parma-2027-04-17", "Fiorentina", "Parma", "32 тур", "17 апреля 2027, время уточняется"],
  ["juventus-fiorentina-2027-04-24", "Juventus", "Fiorentina", "33 тур", "24 апреля 2027, время уточняется"],
  ["bologna-fiorentina-2027-05-01", "Bologna", "Fiorentina", "34 тур", "1 мая 2027, время уточняется"],
  ["fiorentina-roma-2027-05-08", "Fiorentina", "Roma", "35 тур", "8 мая 2027, время уточняется"],
  ["lecce-fiorentina-2027-05-15", "Lecce", "Fiorentina", "36 тур", "15 мая 2027, время уточняется"],
  ["fiorentina-monza-2027-05-22", "Fiorentina", "Monza", "37 тур", "22 мая 2027, время уточняется"],
  ["lazio-fiorentina-2027-05-29", "Lazio", "Fiorentina", "38 тур", "29 мая 2027, время уточняется"],
].map(([slug, homeTeam, awayTeam, round, kickoff]) => ({
  slug,
  homeTeam,
  awayTeam,
  competition: "Serie A",
  round,
  kickoff,
  venue: homeTeam === "Fiorentina" ? "Stadio Artemio Franchi" : "Выездной матч",
}));

export const matchSchedule: MatchItem[] = [...friendlyFixtures, ...serieAFixtures].map(createMatch);

export function getMatchBySlug(slug: string) {
  return matchSchedule.find((match) => match.slug === slug);
}

export function getMatchesByFilter(filter: MatchFilter) {
  if (filter === "all") {
    return matchSchedule;
  }

  return matchSchedule.filter((match) => match.status === filter);
}

export function getFeaturedMatch() {
  return matchSchedule.find((match) => match.status === "upcoming") ?? matchSchedule[0];
}

function createMatch(seed: FixtureSeed): MatchItem {
  const isHome = seed.homeTeam === "Fiorentina";

  return {
    slug: seed.slug,
    homeTeam: seed.homeTeam,
    awayTeam: seed.awayTeam,
    competition: seed.competition,
    round: seed.round,
    kickoff: seed.kickoff,
    venue: seed.venue ?? (isHome ? "Stadio Artemio Franchi" : "Выездной матч"),
    status: "upcoming",
    resultLabel: "До матча",
    headline: `${seed.homeTeam} vs ${seed.awayTeam}: матч в календаре Fiorentina`,
    summary: `${seed.round}. В календаре собраны дата, соперник, турнир и быстрый переход к материалам перед игрой.`,
    coverImage: isHome ? imageAssets.stadium : imageAssets.fansFlags,
    countdown: [],
    form: defaultForm,
    events: defaultEvents,
    stats: defaultStats,
    lineup: defaultLineup,
  };
}
