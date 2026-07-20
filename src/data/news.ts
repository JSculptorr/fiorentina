import { imageAssets } from "@/src/data/assets";

export type NewsCategory =
  | "all"
  | "matches"
  | "transfers"
  | "team"
  | "history"
  | "community";

export type NewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: Exclude<NewsCategory, "all">;
  author: string;
  publishedAt: string;
  readTime: string;
  views: string;
  coverImage: string;
  sourceLabel?: string;
  sourceUrl?: string;
  featured?: boolean;
  localDraft?: boolean;
  body: string[];
  relatedSlugs: string[];
};

export type TransferStatus = "interest" | "rumor" | "talks" | "signed" | "exit";

export type TransferItem = {
  player: string;
  position: string;
  status: TransferStatus;
  reliability: "низкая" | "средняя" | "высокая";
  updatedAt: string;
  summary: string;
  coverImage?: string;
};

export const newsCategories: Array<{ label: string; value: NewsCategory }> = [
  { label: "Все", value: "all" },
  { label: "Матчи", value: "matches" },
  { label: "Трансферы", value: "transfers" },
  { label: "Команда", value: "team" },
  { label: "История", value: "history" },
  { label: "Сообщество", value: "community" },
];

export const baseNews: NewsArticle[] = [
  {
    slug: "gosens-farewell-letter-telegram",
    title: "Робин Гозенс попрощался с «Фиорентиной»",
    excerpt:
      "В свежем посте канала опубликовано прощальное письмо Гозенса после истории с уходом в «Шальке».",
    category: "transfers",
    author: "Fiorentina | Giardino Viola",
    publishedAt: "17 июля 2026",
    readTime: "3 мин",
    views: "Telegram",
    coverImage: imageAssets.fansFlags,
    sourceLabel: "Telegram / Giardino Viola",
    sourceUrl: "https://t.me/acf_fiorentina_rus/4518",
    featured: true,
    body: [
      "Канал опубликовал перевод прощального письма Робина Гозенса. Игрок пишет, что уход получился неожиданным и болезненным, потому что он связывал себя с городом, клубом и болельщиками.",
      "В материале подчёркивается эмоциональная сторона расставания: Гозенс благодарит партнёров, сотрудников клуба, тренеров, медштаб, болельщиков и семью Коммиссо.",
      "Для нашей ленты это трансферная новость с человеческим контекстом: не только условия перехода, но и то, как уход воспринимается самим игроком и фанатской средой.",
    ],
    relatedSlugs: ["gosens-schalke-transfer-analysis", "jimenez-official-transfer"],
  },
  {
    slug: "gosens-schalke-transfer-analysis",
    title: "Гозенс и «Шальке»: почему уход вызывает вопросы",
    excerpt:
      "Канал разбирает возможный переход Гозенса в «Шальке»: аренда, опция выкупа и спорная логика решения.",
    category: "transfers",
    author: "Fiorentina | Giardino Viola",
    publishedAt: "16 июля 2026",
    readTime: "4 мин",
    views: "Telegram",
    coverImage: imageAssets.stadium,
    sourceLabel: "Telegram / Giardino Viola",
    sourceUrl: "https://t.me/acf_fiorentina_rus/4516",
    body: [
      "В канале переход Гозенса в «Шальке» описывается как почти решённая история: речь идёт об аренде с правом выкупа за 2,5 млн евро, которое может стать обязательством при сохранении немецкого клуба в Бундеслиге.",
      "Автор видит понятную финансовую логику, но указывает и на риски: позиция левого защитника остаётся тонкой, а сам Гозенс был одним из немногих игроков с лидерским весом в раздевалке.",
      "Материал важен для трансферного радара: это не просто слух о выходящем трансфере, а разбор последствий для состава и баланса команды.",
    ],
    relatedSlugs: ["gosens-farewell-letter-telegram", "jimenez-official-transfer"],
  },
  {
    slug: "jimenez-official-transfer",
    title: "Алекс Хименес стал игроком «Фиорентины»",
    excerpt:
      "Канал сообщает об официальном переходе Алекса Хименеса и обещает отдельный обзор по игроку.",
    category: "transfers",
    author: "Fiorentina | Giardino Viola",
    publishedAt: "15 июля 2026",
    readTime: "2 мин",
    views: "Telegram",
    coverImage: imageAssets.playerHeader,
    sourceLabel: "Telegram / Giardino Viola",
    sourceUrl: "https://t.me/acf_fiorentina_rus/4515",
    body: [
      "В свежей ленте канала Хименес отмечен как очередное официальное усиление «Фиорентины». Формат сделки описан как аренда со сложными условиями.",
      "Для сайта мы фиксируем это как подтверждённый входящий трансфер и оставляем место под будущий подробный профиль игрока.",
      "Такие короткие новости хорошо подходят для статического портала: заголовок, статус, дата, источник и ссылка на оригинальный Telegram-пост.",
    ],
    relatedSlugs: ["dragusin-transfer-profile", "gosens-schalke-transfer-analysis"],
  },
  {
    slug: "dragusin-transfer-profile",
    title: "Раду Дрэгушин: первые выводы по новому защитнику",
    excerpt:
      "В канале вышел большой разбор Дрэгушина: сильная атлетика, смелость и вопросы по решениям на мяче.",
    category: "transfers",
    author: "Fiorentina | Giardino Viola",
    publishedAt: "14 июля 2026",
    readTime: "5 мин",
    views: "Telegram",
    coverImage: imageAssets.kitGroup,
    sourceLabel: "Telegram / Giardino Viola",
    sourceUrl: "https://t.me/acf_fiorentina_rus/4514",
    body: [
      "Канал опубликовал первую часть обзора Раду Дрэгушина. Игрок описан как очень атлетичный центральный защитник с силой, скоростью, прыжком и смелостью в игре.",
      "При этом автор отмечает и риски: хаотичность, спорное принятие решений, проблемы с концентрацией и контекст травмы крестообразных связок в 2025 году.",
      "Для трансферной ленты это хороший пример материала не только о факте перехода, но и о том, как новичок может вписаться в модель команды.",
    ],
    relatedSlugs: ["jimenez-official-transfer", "gosens-schalke-transfer-analysis"],
  },
];

export const baseTransfers: TransferItem[] = [
  {
    player: "Алекс Хименес",
    position: "Фланг обороны",
    status: "signed",
    reliability: "высокая",
    updatedAt: "15 июля 2026",
    coverImage: imageAssets.playerHeader,
    summary:
      "Канал сообщает об официальном переходе. Условия аренды сложные, подробный обзор игрока ожидается отдельно.",
  },
  {
    player: "Робин Гозенс",
    position: "Левый фланг",
    status: "exit",
    reliability: "средняя",
    updatedAt: "17 июля 2026",
    coverImage: imageAssets.fansFlags,
    summary:
      "Переход в «Шальке» подаётся как решённая история; в канале вышло прощальное письмо игрока.",
  },
  {
    player: "Раду Дрэгушин",
    position: "Центральный защитник",
    status: "signed",
    reliability: "высокая",
    updatedAt: "14 июля 2026",
    coverImage: imageAssets.kitGroup,
    summary:
      "В ленте опубликован большой разбор новичка: атлетика и характер как плюсы, принятие решений как риск.",
  },
];

export const transferStatusLabels: Record<TransferStatus, string> = {
  interest: "Интерес",
  rumor: "Слух",
  talks: "Переговоры",
  signed: "Подписан",
  exit: "Ушёл",
};

export function getArticleBySlug(slug: string) {
  return baseNews.find((article) => article.slug === slug);
}

export function getRelatedArticles(article: NewsArticle, articles: NewsArticle[] = baseNews) {
  return article.relatedSlugs
    .map((slug) => articles.find((item) => item.slug === slug))
    .filter((item): item is NewsArticle => Boolean(item));
}

export function filterArticleList(articles: NewsArticle[], category: NewsCategory, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return articles.filter((article) => {
    const matchesCategory = category === "all" || article.category === category;
    const matchesQuery =
      !normalizedQuery ||
      [article.title, article.excerpt, article.author]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });
}

export function filterNews(category: NewsCategory, query: string) {
  return filterArticleList(baseNews, category, query);
}
