"use client";

import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/src/components/layout/site-header";
import { imageAssets } from "@/src/data/assets";
import {
  matchSchedule,
  matchStatusLabels,
  type MatchItem,
  type MatchStatus,
} from "@/src/data/matches";
import {
  baseNews,
  baseTransfers,
  newsCategories,
  transferStatusLabels,
  type NewsArticle,
  type NewsCategory,
  type TransferItem,
} from "@/src/data/news";
import {
  createArticleSlug,
  createMatchSlug,
  defaultLocalHome,
  defaultLocalSettings,
  getMatchHref,
  mergeArticles,
  mergeMatches,
  mergeTransfers,
  useLocalContent,
  type LocalContent,
  type LocalHomeContent,
  type LocalSettings,
} from "@/src/lib/local-content";

type ArticleForm = Omit<NewsArticle, "body" | "relatedSlugs"> & {
  bodyText: string;
};

type TransferForm = TransferItem;

type MatchForm = Omit<MatchItem, "countdown" | "events" | "form" | "lineup" | "stats"> & {
  noteText: string;
  formText: string;
  lineupText: string;
};

const imageOptions = [
  { label: "Стадион", value: imageAssets.stadium },
  { label: "Фанаты с флагами", value: imageAssets.fansFlags },
  { label: "Тифо на трибуне", value: imageAssets.fansTifo },
  { label: "Игрок горизонтально", value: imageAssets.playerHeader },
  { label: "Игрок крупным планом", value: imageAssets.playerMain },
  { label: "Команда / форма", value: imageAssets.kitGroup },
  { label: "Клубный знак", value: imageAssets.clubLogo },
];

function isCustomImage(value: string | undefined) {
  return Boolean(value?.startsWith("data:image/"));
}

const categoryOptions = newsCategories.filter(
  (item): item is { label: string; value: Exclude<NewsCategory, "all"> } => item.value !== "all",
);

const emptyArticleForm: ArticleForm = {
  slug: "",
  title: "",
  excerpt: "",
  category: "transfers",
  author: "Viola admin",
  publishedAt: "Сегодня",
  readTime: "3 мин",
  views: "Admin",
  coverImage: imageAssets.fansFlags,
  sourceLabel: "Telegram / Giardino Viola",
  sourceUrl: "",
  featured: true,
  bodyText: "",
};

const emptyTransferForm: TransferForm = {
  player: "",
  position: "",
  status: "rumor",
  reliability: "средняя",
  updatedAt: "Сегодня",
  summary: "",
  coverImage: imageAssets.playerHeader,
};

const emptyMatchForm: MatchForm = {
  slug: "",
  homeTeam: "Fiorentina",
  awayTeam: "",
  competition: "Serie A",
  round: "",
  kickoff: "",
  venue: "Stadio Artemio Franchi",
  status: "upcoming",
  score: "",
  resultLabel: "До матча",
  headline: "",
  summary: "",
  coverImage: imageAssets.stadium,
  localDraft: true,
  noteText: "",
  formText: "D\nW\nD\nW\nD",
  lineupText: "Перед матчем: Превью, новости состава, материалы перед игрой",
};

export function LocalAdminPage() {
  const { articles, transfers, matches, home, settings, saveContent } = useLocalContent();
  const [articleForm, setArticleForm] = useState<ArticleForm>(emptyArticleForm);
  const [transferForm, setTransferForm] = useState<TransferForm>(emptyTransferForm);
  const [matchForm, setMatchForm] = useState<MatchForm>(emptyMatchForm);
  const [homeForm, setHomeForm] = useState<LocalHomeContent>(defaultLocalHome);
  const [settingsForm, setSettingsForm] = useState<LocalSettings>(defaultLocalSettings);
  const [importValue, setImportValue] = useState("");
  const [notice, setNotice] = useState("Локальная админка готова.");
  const allArticles = mergeArticles(articles, baseNews);
  const allTransfers = mergeTransfers(transfers, baseTransfers);
  const allMatches = mergeMatches(matches, matchSchedule);
  const localArticleSlugs = new Set(articles.map((article) => article.slug));
  const localTransferPlayers = new Set(transfers.map((item) => item.player));
  const localMatchSlugs = new Set(matches.map((match) => match.slug));

  const exportValue = useMemo(
    () => JSON.stringify({ articles, transfers, matches, home, settings }, null, 2),
    [articles, transfers, matches, home, settings],
  );

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  useEffect(() => {
    setHomeForm(home);
  }, [home]);

  function saveSettings() {
    const nextSettings: LocalSettings = {
      telegramUrl: settingsForm.telegramUrl.trim() || defaultLocalSettings.telegramUrl,
      partnerTitle: settingsForm.partnerTitle.trim() || defaultLocalSettings.partnerTitle,
      partnerText: settingsForm.partnerText.trim() || defaultLocalSettings.partnerText,
      partnerButtonLabel:
        settingsForm.partnerButtonLabel.trim() || defaultLocalSettings.partnerButtonLabel,
      partnerHref: settingsForm.partnerHref.trim() || defaultLocalSettings.partnerHref,
    };

    saveContent({ articles, transfers, matches, home, settings: nextSettings });
    setSettingsForm(nextSettings);
    setNotice("Настройки сайта сохранены: Telegram и рекламный блок обновятся на портале.");
  }

  function saveHome() {
    const nextHome: LocalHomeContent = {
      heroEyebrow: homeForm.heroEyebrow.trim() || defaultLocalHome.heroEyebrow,
      heroTitle: homeForm.heroTitle.trim() || defaultLocalHome.heroTitle,
      heroText: homeForm.heroText.trim() || defaultLocalHome.heroText,
      mediaCards: homeForm.mediaCards.map((card, index) => ({
        eyebrow: card.eyebrow.trim() || defaultLocalHome.mediaCards[index].eyebrow,
        title: card.title.trim() || defaultLocalHome.mediaCards[index].title,
        image: card.image || defaultLocalHome.mediaCards[index].image,
      })),
      fanEyebrow: homeForm.fanEyebrow.trim() || defaultLocalHome.fanEyebrow,
      fanTitle: homeForm.fanTitle.trim() || defaultLocalHome.fanTitle,
      fanText: homeForm.fanText.trim() || defaultLocalHome.fanText,
      fanImage: homeForm.fanImage || defaultLocalHome.fanImage,
      footerTitle: homeForm.footerTitle.trim() || defaultLocalHome.footerTitle,
      footerText: homeForm.footerText.trim() || defaultLocalHome.footerText,
      footerStatusText: homeForm.footerStatusText.trim() || defaultLocalHome.footerStatusText,
    };

    saveContent({ articles, transfers, matches, home: nextHome, settings });
    setHomeForm(nextHome);
    setNotice("Главная страница сохранена: тексты и фото обновятся на портале.");
  }

  function saveArticle() {
    const title = articleForm.title.trim();
    const excerpt = articleForm.excerpt.trim();

    if (!title || !excerpt) {
      setNotice("Для новости нужен минимум заголовок и короткое описание.");
      return;
    }

    const slug = articleForm.slug.trim() || createArticleSlug(title);
    const body = articleForm.bodyText
      .split(/\n{2,}/)
      .map((item) => item.trim())
      .filter(Boolean);
    const article: NewsArticle = {
      ...articleForm,
      slug,
      title,
      excerpt,
      body: body.length > 0 ? body : [excerpt],
      relatedSlugs: [],
      sourceUrl: articleForm.sourceUrl?.trim() || undefined,
      sourceLabel: articleForm.sourceLabel?.trim() || undefined,
      localDraft: true,
    };
    const nextArticles = [article, ...articles.filter((item) => item.slug !== slug)];

    saveContent({ articles: nextArticles, transfers, matches, home, settings });
    setArticleForm(emptyArticleForm);
    setNotice("Новость сохранена. Она уже появилась на главной и в разделе новостей.");
  }

  function editArticle(article: NewsArticle) {
    setArticleForm({
      ...article,
      bodyText: article.body.join("\n\n"),
    });
    setNotice("Материал загружен в форму. Можно править и сохранить заново.");
  }

  function deleteArticle(slug: string) {
    saveContent({ articles: articles.filter((item) => item.slug !== slug), transfers, matches, home, settings });
    setNotice("Новость удалена из локальной админки.");
  }

  async function uploadArticleImage(file: File | undefined) {
    if (!file) {
      return;
    }

    try {
      const coverImage = await resizeImageFile(file);
      setArticleForm((current) => ({ ...current, coverImage }));
      setNotice("Фото загружено и автоматически подогнано под обложку 16:9.");
    } catch {
      setNotice("Фото не получилось обработать. Попробуй другой файл JPG, PNG или WEBP.");
    }
  }

  async function uploadTransferImage(file: File | undefined) {
    if (!file) {
      return;
    }

    try {
      const coverImage = await resizeImageFile(file);
      setTransferForm((current) => ({ ...current, coverImage }));
      setNotice("Фото трансфера загружено и подогнано под карточку 16:9.");
    } catch {
      setNotice("Фото трансфера не получилось обработать. Попробуй другой JPG, PNG или WEBP.");
    }
  }

  async function uploadMatchImage(file: File | undefined) {
    if (!file) {
      return;
    }

    try {
      const coverImage = await resizeImageFile(file);
      setMatchForm((current) => ({ ...current, coverImage }));
      setNotice("Фото матча загружено и подогнано под обложку 16:9.");
    } catch {
      setNotice("Фото матча не получилось обработать. Попробуй другой JPG, PNG или WEBP.");
    }
  }

  async function uploadHomeMediaImage(index: number, file: File | undefined) {
    if (!file) {
      return;
    }

    try {
      const image = await resizeImageFile(file);
      setHomeForm((current) => ({
        ...current,
        mediaCards: current.mediaCards.map((card, cardIndex) =>
          cardIndex === index ? { ...card, image } : card,
        ),
      }));
      setNotice("Фото верхнего блока загружено и подогнано под 16:9.");
    } catch {
      setNotice("Фото верхнего блока не получилось обработать. Попробуй другой JPG, PNG или WEBP.");
    }
  }

  async function uploadHomeFanImage(file: File | undefined) {
    if (!file) {
      return;
    }

    try {
      const fanImage = await resizeImageFile(file);
      setHomeForm((current) => ({ ...current, fanImage }));
      setNotice("Фото fan-zone загружено и подогнано под 16:9.");
    } catch {
      setNotice("Фото fan-zone не получилось обработать. Попробуй другой JPG, PNG или WEBP.");
    }
  }

  function saveMatch() {
    const homeTeam = matchForm.homeTeam.trim();
    const awayTeam = matchForm.awayTeam.trim();
    const kickoff = matchForm.kickoff.trim();

    if (!homeTeam || !awayTeam || !kickoff) {
      setNotice("Для матча нужны минимум хозяева, соперник и дата.");
      return;
    }

    const slug = matchForm.slug.trim() || createMatchSlug(homeTeam, awayTeam, kickoff);
    const round = matchForm.round.trim() || "Матч";
    const venue = matchForm.venue.trim() || "Stadio Artemio Franchi";
    const headline =
      matchForm.headline.trim() || `${homeTeam} vs ${awayTeam}: матч в календаре Fiorentina`;
    const summary =
      matchForm.summary.trim() || `${round}. ${kickoff}. ${venue}. Матч добавлен через админку.`;
    const noteText =
      matchForm.noteText.trim() || `${round}. ${kickoff}. ${venue}. Матч-центр готов к обновлению.`;

    const match: MatchItem = {
      slug,
      homeTeam,
      awayTeam,
      competition: matchForm.competition.trim() || "Serie A",
      round,
      kickoff,
      venue,
      status: matchForm.status,
      score: matchForm.score?.trim() || undefined,
      resultLabel:
        matchForm.resultLabel.trim() ||
        (matchForm.status === "finished" ? "Результат" : "До матча"),
      headline,
      summary,
      coverImage: matchForm.coverImage || imageAssets.stadium,
      countdown: [],
      form: matchForm.formText
        .split(/\n+/)
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 5),
      events: [
        {
          minute: matchForm.status === "finished" ? "Итог" : "До матча",
          team: "Viola desk",
          type: "note",
          text: noteText,
        },
      ],
      stats: [],
      lineup: parseLineupText(matchForm.lineupText),
      localDraft: true,
    };
    const nextMatches = [match, ...matches.filter((item) => item.slug !== slug)];

    saveContent({ articles, transfers, matches: nextMatches, home, settings });
    setMatchForm(emptyMatchForm);
    setNotice("Матч сохранён. Он обновится на главной и в календаре матчей.");
  }

  function editMatch(match: MatchItem) {
    setMatchForm(matchToForm(match));
    setNotice("Матч загружен в форму. Можно править и сохранить заново.");
  }

  function deleteMatch(slug: string) {
    saveContent({ articles, transfers, matches: matches.filter((item) => item.slug !== slug), home, settings });
    setNotice("Локальная правка матча сброшена.");
  }

  function saveTransfer() {
    if (!transferForm.player.trim()) {
      setNotice("Для трансфера нужно указать имя игрока.");
      return;
    }

    const nextTransfers = [
      transferForm,
      ...transfers.filter((item) => item.player !== transferForm.player),
    ];

    saveContent({ articles, transfers: nextTransfers, matches, home, settings });
    setTransferForm(emptyTransferForm);
    setNotice("Трансфер сохранён в локальном радаре.");
  }

  function editTransfer(item: TransferItem) {
    setTransferForm(item);
    setNotice("Трансфер загружен в форму. Можно править и сохранить заново.");
  }

  function deleteTransfer(player: string) {
    saveContent({ articles, transfers: transfers.filter((item) => item.player !== player), matches, home, settings });
    setNotice("Трансфер удалён из локального радара.");
  }

  function importContent() {
    try {
      const parsed = JSON.parse(importValue) as Partial<LocalContent>;
      saveContent({
        articles: Array.isArray(parsed.articles) ? parsed.articles : [],
        transfers: Array.isArray(parsed.transfers) ? parsed.transfers : [],
        matches: Array.isArray(parsed.matches) ? parsed.matches : [],
        home: parsed.home ?? home,
        settings: parsed.settings ?? settings,
      });
      setImportValue("");
      setNotice("JSON импортирован. Проверь главную и раздел новостей.");
    } catch {
      setNotice("JSON не импортирован: проверь формат текста.");
    }
  }

  function downloadJson() {
    const blob = new Blob([exportValue], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "viola-local-content.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="admin-stage">
      <SiteHeader showAdmin />

      <section className="admin-hero">
        <p>Local editor</p>
        <h1>Админка для новостей и трансферов</h1>
        <span>
          Данные сохраняются в браузере на этом компьютере. Здесь можно быстро готовить
          новости, трансферы, обложки и тексты для портала.
        </span>
        <strong>{notice}</strong>
      </section>

      <section className="admin-grid">
        <article className="admin-panel admin-panel--wide">
          <div className="admin-panel__head">
            <p>Site settings</p>
            <h2>Настройки портала</h2>
          </div>

          <div className="admin-form">
            <label className="admin-form__full">
              Telegram ссылка
              <input
                value={settingsForm.telegramUrl}
                onChange={(event) =>
                  setSettingsForm({ ...settingsForm, telegramUrl: event.target.value })
                }
                placeholder="https://t.me/acf_fiorentina_rus"
              />
            </label>
            <label>
              Заголовок рекламы
              <input
                value={settingsForm.partnerTitle}
                onChange={(event) =>
                  setSettingsForm({ ...settingsForm, partnerTitle: event.target.value })
                }
              />
            </label>
            <label>
              Текст кнопки рекламы
              <input
                value={settingsForm.partnerButtonLabel}
                onChange={(event) =>
                  setSettingsForm({ ...settingsForm, partnerButtonLabel: event.target.value })
                }
              />
            </label>
            <label className="admin-form__full">
              Описание рекламы
              <textarea
                rows={4}
                value={settingsForm.partnerText}
                onChange={(event) =>
                  setSettingsForm({ ...settingsForm, partnerText: event.target.value })
                }
              />
            </label>
            <label className="admin-form__full">
              Ссылка кнопки рекламы
              <input
                value={settingsForm.partnerHref}
                onChange={(event) =>
                  setSettingsForm({ ...settingsForm, partnerHref: event.target.value })
                }
                placeholder="/partners"
              />
            </label>
            <button type="button" onClick={saveSettings}>
              Сохранить настройки
            </button>
          </div>
        </article>

        <article className="admin-panel admin-panel--wide">
          <div className="admin-panel__head">
            <p>Home editor</p>
            <h2>Главная страница</h2>
          </div>

          <div className="admin-form">
            <label className="admin-form__full">
              Маленький текст над hero
              <input
                value={homeForm.heroEyebrow}
                onChange={(event) => setHomeForm({ ...homeForm, heroEyebrow: event.target.value })}
              />
            </label>
            <label className="admin-form__full">
              Заголовок hero
              <textarea
                rows={3}
                value={homeForm.heroTitle}
                onChange={(event) => setHomeForm({ ...homeForm, heroTitle: event.target.value })}
              />
            </label>
            <label className="admin-form__full">
              Текст hero
              <textarea
                rows={4}
                value={homeForm.heroText}
                onChange={(event) => setHomeForm({ ...homeForm, heroText: event.target.value })}
              />
            </label>

            {homeForm.mediaCards.map((card, index) => (
              <div className="admin-home-card" key={index}>
                <strong>Верхний фото-блок {index + 1}</strong>
                <label>
                  Метка
                  <input
                    value={card.eyebrow}
                    onChange={(event) =>
                      setHomeForm((current) => ({
                        ...current,
                        mediaCards: current.mediaCards.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, eyebrow: event.target.value } : item,
                        ),
                      }))
                    }
                  />
                </label>
                <label>
                  Заголовок
                  <input
                    value={card.title}
                    onChange={(event) =>
                      setHomeForm((current) => ({
                        ...current,
                        mediaCards: current.mediaCards.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, title: event.target.value } : item,
                        ),
                      }))
                    }
                  />
                </label>
                <label>
                  Фото
                  <select
                    value={card.image}
                    onChange={(event) =>
                      setHomeForm((current) => ({
                        ...current,
                        mediaCards: current.mediaCards.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, image: event.target.value } : item,
                        ),
                      }))
                    }
                  >
                    {isCustomImage(card.image) ? (
                      <option value={card.image}>Загруженное фото</option>
                    ) : null}
                    {imageOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Загрузить фото
                  <input
                    accept="image/png,image/jpeg,image/webp,image/avif"
                    onChange={(event) => uploadHomeMediaImage(index, event.target.files?.[0])}
                    type="file"
                  />
                </label>
                <div
                  aria-label={`Превью верхнего блока ${index + 1}`}
                  className="admin-cover-preview"
                  style={{ backgroundImage: `url("${card.image}")` }}
                />
              </div>
            ))}

            <label>
              Fan-zone метка
              <input
                value={homeForm.fanEyebrow}
                onChange={(event) => setHomeForm({ ...homeForm, fanEyebrow: event.target.value })}
              />
            </label>
            <label>
              Fan-zone заголовок
              <input
                value={homeForm.fanTitle}
                onChange={(event) => setHomeForm({ ...homeForm, fanTitle: event.target.value })}
              />
            </label>
            <label className="admin-form__full">
              Fan-zone текст
              <textarea
                rows={4}
                value={homeForm.fanText}
                onChange={(event) => setHomeForm({ ...homeForm, fanText: event.target.value })}
              />
            </label>
            <label>
              Fan-zone фото
              <select
                value={homeForm.fanImage}
                onChange={(event) => setHomeForm({ ...homeForm, fanImage: event.target.value })}
              >
                {isCustomImage(homeForm.fanImage) ? (
                  <option value={homeForm.fanImage}>Загруженное фото</option>
                ) : null}
                {imageOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Загрузить fan-zone фото
              <input
                accept="image/png,image/jpeg,image/webp,image/avif"
                onChange={(event) => uploadHomeFanImage(event.target.files?.[0])}
                type="file"
              />
            </label>
            <div
              aria-label="Превью fan-zone"
              className="admin-cover-preview"
              style={{ backgroundImage: `url("${homeForm.fanImage}")` }}
            />
            <label className="admin-form__full">
              Footer заголовок
              <input
                value={homeForm.footerTitle}
                onChange={(event) => setHomeForm({ ...homeForm, footerTitle: event.target.value })}
              />
            </label>
            <label className="admin-form__full">
              Footer текст
              <textarea
                rows={4}
                value={homeForm.footerText}
                onChange={(event) => setHomeForm({ ...homeForm, footerText: event.target.value })}
              />
            </label>
            <label className="admin-form__full">
              Footer match desk текст
              <textarea
                rows={3}
                value={homeForm.footerStatusText}
                onChange={(event) =>
                  setHomeForm({ ...homeForm, footerStatusText: event.target.value })
                }
              />
            </label>
            <button type="button" onClick={saveHome}>
              Сохранить главную
            </button>
          </div>
        </article>

        <article className="admin-panel admin-panel--wide">
          <div className="admin-panel__head">
            <p>Match editor</p>
            <h2>Календарь матчей</h2>
          </div>

          <div className="admin-picker">
            <label>
              Редактировать существующий матч
              <select
                value=""
                onChange={(event) => {
                  const match = allMatches.find((item) => item.slug === event.target.value);
                  if (match) {
                    editMatch(match);
                  }
                }}
              >
                <option value="">Выбрать матч</option>
                {allMatches.map((match) => (
                  <option key={match.slug} value={match.slug}>
                    {localMatchSlugs.has(match.slug) ? "Из админки" : "Базовый"} - {match.homeTeam} vs {match.awayTeam}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="admin-form">
            <label>
              Хозяева
              <input
                value={matchForm.homeTeam}
                onChange={(event) => setMatchForm({ ...matchForm, homeTeam: event.target.value })}
              />
            </label>
            <label>
              Соперник
              <input
                value={matchForm.awayTeam}
                onChange={(event) => setMatchForm({ ...matchForm, awayTeam: event.target.value })}
              />
            </label>
            <label>
              Slug
              <input
                value={matchForm.slug}
                onChange={(event) => setMatchForm({ ...matchForm, slug: event.target.value })}
                placeholder="Создастся автоматически"
              />
            </label>
            <label>
              Статус
              <select
                value={matchForm.status}
                onChange={(event) =>
                  setMatchForm({ ...matchForm, status: event.target.value as MatchStatus })
                }
              >
                <option value="upcoming">{matchStatusLabels.upcoming}</option>
                <option value="finished">{matchStatusLabels.finished}</option>
              </select>
            </label>
            <label>
              Турнир
              <input
                value={matchForm.competition}
                onChange={(event) =>
                  setMatchForm({ ...matchForm, competition: event.target.value })
                }
              />
            </label>
            <label>
              Тур / этап
              <input
                value={matchForm.round}
                onChange={(event) => setMatchForm({ ...matchForm, round: event.target.value })}
              />
            </label>
            <label>
              Дата и время
              <input
                value={matchForm.kickoff}
                onChange={(event) => setMatchForm({ ...matchForm, kickoff: event.target.value })}
                placeholder="22 июля 2026, 19:00"
              />
            </label>
            <label>
              Стадион
              <input
                value={matchForm.venue}
                onChange={(event) => setMatchForm({ ...matchForm, venue: event.target.value })}
              />
            </label>
            <label>
              Счёт
              <input
                value={matchForm.score ?? ""}
                onChange={(event) => setMatchForm({ ...matchForm, score: event.target.value })}
                placeholder="Например 2:1"
              />
            </label>
            <label>
              Метка
              <input
                value={matchForm.resultLabel}
                onChange={(event) =>
                  setMatchForm({ ...matchForm, resultLabel: event.target.value })
                }
                placeholder="До матча / Результат"
              />
            </label>
            <label className="admin-form__full">
              Заголовок матч-центра
              <input
                value={matchForm.headline}
                onChange={(event) =>
                  setMatchForm({ ...matchForm, headline: event.target.value })
                }
              />
            </label>
            <label className="admin-form__full">
              Короткое описание
              <textarea
                rows={3}
                value={matchForm.summary}
                onChange={(event) => setMatchForm({ ...matchForm, summary: event.target.value })}
              />
            </label>
            <label className="admin-form__full">
              Заметка матч-центра
              <textarea
                rows={4}
                value={matchForm.noteText}
                onChange={(event) => setMatchForm({ ...matchForm, noteText: event.target.value })}
              />
            </label>
            <label>
              Обложка
              <select
                value={matchForm.coverImage}
                onChange={(event) =>
                  setMatchForm({ ...matchForm, coverImage: event.target.value })
                }
              >
                {isCustomImage(matchForm.coverImage) ? (
                  <option value={matchForm.coverImage ?? ""}>Загруженное фото</option>
                ) : null}
                {imageOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Загрузить фото
              <input
                accept="image/png,image/jpeg,image/webp,image/avif"
                onChange={(event) => uploadMatchImage(event.target.files?.[0])}
                type="file"
              />
            </label>
            <div
              aria-label="Превью обложки матча"
              className="admin-cover-preview"
              style={{ backgroundImage: `url("${matchForm.coverImage}")` }}
            />
            <label className="admin-form__full">
              Форма команды
              <textarea
                rows={3}
                value={matchForm.formText}
                onChange={(event) => setMatchForm({ ...matchForm, formText: event.target.value })}
                placeholder="Каждый результат с новой строки: W, D, L"
              />
            </label>
            <label className="admin-form__full">
              Состав и фокус
              <textarea
                rows={4}
                value={matchForm.lineupText}
                onChange={(event) =>
                  setMatchForm({ ...matchForm, lineupText: event.target.value })
                }
                placeholder="Перед матчем: превью, новости состава"
              />
            </label>
            <button type="button" onClick={saveMatch}>
              Сохранить матч
            </button>
          </div>
        </article>

        <article className="admin-panel admin-panel--wide">
          <div className="admin-panel__head">
            <p>News editor</p>
            <h2>Новая новость</h2>
          </div>

          <div className="admin-picker">
            <label>
              Редактировать существующую новость
              <select
                value=""
                onChange={(event) => {
                  const article = allArticles.find((item) => item.slug === event.target.value);
                  if (article) {
                    editArticle(article);
                  }
                }}
              >
                <option value="">Выбрать материал</option>
                {allArticles.map((article) => (
                  <option key={article.slug} value={article.slug}>
                    {localArticleSlugs.has(article.slug) ? "Из админки" : "Базовая"} - {article.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="admin-form">
            <label>
              Заголовок
              <input
                value={articleForm.title}
                onChange={(event) =>
                  setArticleForm((current) => ({
                    ...current,
                    title: event.target.value,
                    slug: current.slug || createArticleSlug(event.target.value),
                  }))
                }
              />
            </label>
            <label>
              Slug
              <input
                value={articleForm.slug}
                onChange={(event) => setArticleForm({ ...articleForm, slug: event.target.value })}
              />
            </label>
            <label>
              Категория
              <select
                value={articleForm.category}
                onChange={(event) =>
                  setArticleForm({
                    ...articleForm,
                    category: event.target.value as Exclude<NewsCategory, "all">,
                  })
                }
              >
                {categoryOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Дата
              <input
                value={articleForm.publishedAt}
                onChange={(event) =>
                  setArticleForm({ ...articleForm, publishedAt: event.target.value })
                }
              />
            </label>
            <label className="admin-form__full">
              Короткое описание
              <textarea
                rows={3}
                value={articleForm.excerpt}
                onChange={(event) => setArticleForm({ ...articleForm, excerpt: event.target.value })}
              />
            </label>
            <label className="admin-form__full">
              Текст статьи
              <textarea
                rows={8}
                placeholder="Новый абзац отделяй пустой строкой."
                value={articleForm.bodyText}
                onChange={(event) =>
                  setArticleForm({ ...articleForm, bodyText: event.target.value })
                }
              />
            </label>
            <label>
              Обложка
              <select
                value={articleForm.coverImage}
                onChange={(event) =>
                  setArticleForm({ ...articleForm, coverImage: event.target.value })
                }
              >
                {isCustomImage(articleForm.coverImage) ? (
                  <option value={articleForm.coverImage ?? ""}>Загруженное фото</option>
                ) : null}
                {imageOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Загрузить фото
              <input
                accept="image/png,image/jpeg,image/webp,image/avif"
                onChange={(event) => uploadArticleImage(event.target.files?.[0])}
                type="file"
              />
            </label>
            <div
              aria-label="Превью обложки"
              className="admin-cover-preview"
              style={{ backgroundImage: `url("${articleForm.coverImage}")` }}
            />
            <label>
              Источник
              <input
                value={articleForm.sourceUrl ?? ""}
                onChange={(event) =>
                  setArticleForm({ ...articleForm, sourceUrl: event.target.value })
                }
                placeholder="https://t.me/acf_fiorentina_rus/..."
              />
            </label>
            <label className="admin-check">
              <input
                checked={Boolean(articleForm.featured)}
                onChange={(event) =>
                  setArticleForm({ ...articleForm, featured: event.target.checked })
                }
                type="checkbox"
              />
              Главная новость
            </label>
            <button type="button" onClick={saveArticle}>
              Сохранить новость
            </button>
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel__head">
            <p>Transfer radar</p>
            <h2>Трансфер</h2>
          </div>
          <div className="admin-picker">
            <label>
              Редактировать существующий трансфер
              <select
                value=""
                onChange={(event) => {
                  const item = allTransfers.find((transfer) => transfer.player === event.target.value);
                  if (item) {
                    editTransfer(item);
                  }
                }}
              >
                <option value="">Выбрать игрока</option>
                {allTransfers.map((item) => (
                  <option key={item.player} value={item.player}>
                    {localTransferPlayers.has(item.player) ? "Из админки" : "Базовый"} - {item.player}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="admin-form admin-form--single">
            <label>
              Игрок
              <input
                value={transferForm.player}
                onChange={(event) =>
                  setTransferForm({ ...transferForm, player: event.target.value })
                }
              />
            </label>
            <label>
              Позиция
              <input
                value={transferForm.position}
                onChange={(event) =>
                  setTransferForm({ ...transferForm, position: event.target.value })
                }
              />
            </label>
            <label>
              Статус
              <select
                value={transferForm.status}
                onChange={(event) =>
                  setTransferForm({
                    ...transferForm,
                    status: event.target.value as TransferItem["status"],
                  })
                }
              >
                {Object.entries(transferStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Надёжность
              <select
                value={transferForm.reliability}
                onChange={(event) =>
                  setTransferForm({
                    ...transferForm,
                    reliability: event.target.value as TransferItem["reliability"],
                  })
                }
              >
                <option value="низкая">Низкая</option>
                <option value="средняя">Средняя</option>
                <option value="высокая">Высокая</option>
              </select>
            </label>
            <label>
              Обновлено
              <input
                value={transferForm.updatedAt}
                onChange={(event) =>
                  setTransferForm({ ...transferForm, updatedAt: event.target.value })
                }
              />
            </label>
            <label>
              Обложка трансфера
              <select
                value={transferForm.coverImage ?? imageAssets.playerHeader}
                onChange={(event) =>
                  setTransferForm({ ...transferForm, coverImage: event.target.value })
                }
              >
                {isCustomImage(transferForm.coverImage) ? (
                  <option value={transferForm.coverImage ?? ""}>Загруженное фото</option>
                ) : null}
                {imageOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Загрузить новое фото
              <input
                accept="image/png,image/jpeg,image/webp,image/avif"
                onChange={(event) => uploadTransferImage(event.target.files?.[0])}
                type="file"
              />
              <span className="admin-field-hint">После выбора файла нажми “Сохранить трансфер”.</span>
            </label>
            <div
              aria-label="Превью обложки трансфера"
              className="admin-cover-preview"
              style={{ backgroundImage: `url("${transferForm.coverImage ?? imageAssets.playerHeader}")` }}
            />
            <label>
              Заметка
              <textarea
                rows={5}
                value={transferForm.summary}
                onChange={(event) =>
                  setTransferForm({ ...transferForm, summary: event.target.value })
                }
              />
            </label>
            <button type="button" onClick={saveTransfer}>
              Сохранить трансфер
            </button>
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel__head">
            <p>Saved content</p>
            <h2>Все новости</h2>
          </div>
          <div className="admin-list">
            {allArticles.map((article) => (
              <div key={article.slug}>
                <strong>{article.title}</strong>
                <span>{localArticleSlugs.has(article.slug) ? "Из админки" : "Базовая"}</span>
                <button type="button" onClick={() => editArticle(article)}>
                  Править
                </button>
                {localArticleSlugs.has(article.slug) ? (
                  <button type="button" onClick={() => deleteArticle(article.slug)}>
                    Сбросить
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel__head">
            <p>Saved radar</p>
            <h2>Все трансферы</h2>
          </div>
          <div className="admin-list">
            {allTransfers.map((item) => (
              <div key={item.player}>
                <strong>{item.player}</strong>
                <span>{localTransferPlayers.has(item.player) ? "Из админки" : transferStatusLabels[item.status]}</span>
                <button type="button" onClick={() => editTransfer(item)}>
                  Править
                </button>
                {localTransferPlayers.has(item.player) ? (
                  <button type="button" onClick={() => deleteTransfer(item.player)}>
                    Сбросить
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel admin-panel--wide">
          <div className="admin-panel__head">
            <p>Saved matches</p>
            <h2>Все матчи</h2>
          </div>
          <div className="admin-list">
            {allMatches.map((match) => (
              <div key={match.slug}>
                <strong>
                  {match.homeTeam} vs {match.awayTeam}
                </strong>
                <span>{localMatchSlugs.has(match.slug) ? "Из админки" : matchStatusLabels[match.status]}</span>
                <button type="button" onClick={() => editMatch(match)}>
                  Править
                </button>
                <a href={getMatchHref(match)}>Открыть</a>
                {localMatchSlugs.has(match.slug) ? (
                  <button type="button" onClick={() => deleteMatch(match.slug)}>
                    Сбросить
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel admin-panel--wide">
          <div className="admin-panel__head">
            <p>Backup</p>
            <h2>Экспорт и импорт</h2>
          </div>
          <div className="admin-backup">
            <textarea readOnly rows={8} value={exportValue} />
            <textarea
              rows={8}
              value={importValue}
              onChange={(event) => setImportValue(event.target.value)}
              placeholder="Сюда можно вставить JSON из экспорта."
            />
            <button type="button" onClick={downloadJson}>
              Скачать JSON
            </button>
            <button type="button" onClick={importContent}>
              Импортировать JSON
            </button>
          </div>
        </article>
      </section>
    </main>
  );
}

function matchToForm(match: MatchItem): MatchForm {
  return {
    ...match,
    score: match.score ?? "",
    noteText: match.events.map((event) => event.text).join("\n"),
    formText: match.form.join("\n"),
    lineupText: match.lineup
      .map((group) => `${group.title}: ${group.players.join(", ")}`)
      .join("\n"),
  };
}

function parseLineupText(value: string): MatchItem["lineup"] {
  const groups = value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, players] = line.includes(":")
        ? line.split(/:(.*)/s).filter(Boolean)
        : ["Фокус", line];

      return {
        title: title.trim(),
        players: players
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };
    })
    .filter((group) => group.title && group.players.length > 0);

  return groups.length
    ? groups
    : [
        {
          title: "Перед матчем",
          players: ["Превью", "Новости состава", "Материалы перед игрой"],
        },
      ];
}

async function resizeImageFile(file: File) {
  const image = await loadImage(file);
  const targetWidth = 1600;
  const targetHeight = 900;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not available");
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const sourceRatio = image.width / image.height;
  const targetRatio = targetWidth / targetHeight;
  const sourceWidth = sourceRatio > targetRatio ? image.height * targetRatio : image.width;
  const sourceHeight = sourceRatio > targetRatio ? image.height : image.width / targetRatio;
  const sourceX = (image.width - sourceWidth) / 2;
  const sourceY = (image.height - sourceHeight) / 2;

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    targetWidth,
    targetHeight,
  );

  return canvas.toDataURL("image/jpeg", 0.86);
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image load failed"));
    };
    image.src = url;
  });
}
