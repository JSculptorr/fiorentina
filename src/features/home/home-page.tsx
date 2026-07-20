"use client";

import Link from "next/link";
import { directionCards, coreIcons } from "@/src/features/design-directions/design-data";
import { imageAssets } from "@/src/data/assets";
import { getFeaturedMatch, matchSchedule } from "@/src/data/matches";
import { baseNews, type NewsCategory } from "@/src/data/news";
import { SiteFooter } from "@/src/components/layout/site-footer";
import { SiteHeader } from "@/src/components/layout/site-header";
import { getArticleHref, getMatchHref, mergeMatches, useLocalContent } from "@/src/lib/local-content";

export function HomePage() {
  const { ScarfIcon, MatchIcon } = coreIcons;
  const { articles: localArticles, matches: localMatches, home, settings } = useLocalContent();
  const telegramUrl = settings.telegramUrl;
  const allMatches = mergeMatches(localMatches, matchSchedule);
  const featuredMatch =
    allMatches.find((match) => match.status === "upcoming") ?? allMatches[0] ?? getFeaturedMatch();
  const upcomingMatches = allMatches.filter((match) => match.status === "upcoming").slice(0, 4);
  const allArticles = [...localArticles, ...baseNews];
  const leadArticle = allArticles[0];
  const visibleLatestNews = allArticles
    .filter((article) => article.slug !== leadArticle.slug)
    .slice(0, 4)
    .map((article) => ({
      category: getHomeCategoryLabel(article.category),
      title: article.title,
      description: article.excerpt,
      href: getArticleHref(article),
    }));
  const visibleBriefs = allArticles.slice(0, 4).map((article) => ({
    category: getHomeCategoryLabel(article.category),
    title: article.title,
    meta: `${article.author} / ${article.publishedAt}`,
    href: getArticleHref(article),
  }));

  return (
    <main className="home-final">
      <SiteHeader />

      <section className="final-hero">
        <div className="final-hero__photo" aria-hidden="true" />
        <div className="final-hero__copy">
          <p>{home.heroEyebrow}</p>
          <h1>
            {home.heroTitle.split("\n").map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <span>{home.heroText}</span>
          <div className="final-hero__actions">
            <Link href="/news">Читать новости</Link>
            <Link href={telegramUrl}>В Telegram</Link>
          </div>
        </div>
        <aside className="final-match">
          <MatchIcon className="direction-icon" />
          <span>Ближайший матч</span>
          <strong>
            {featuredMatch.homeTeam} vs {featuredMatch.awayTeam}
          </strong>
          <p>
            {featuredMatch.round} / {featuredMatch.kickoff}
          </p>
          <div className="final-match__meta">
            <em>{featuredMatch.competition}</em>
            <em>{featuredMatch.venue}</em>
          </div>
          <Link href={getMatchHref(featuredMatch)}>Подробнее</Link>
        </aside>
      </section>

      <section className="final-strip" aria-label="Ключевые разделы">
        {directionCards.map(({ Icon, ...card }) => (
          <Link href={card.href} className="final-strip__card" key={card.title}>
            <Icon className="direction-icon" />
            <span>{card.title}</span>
            <p>{card.text}</p>
          </Link>
        ))}
      </section>

      <section className="final-media-band" aria-label="Атмосфера Viola">
        {home.mediaCards.map((card) => (
          <article key={`${card.eyebrow}-${card.title}`} style={{ backgroundImage: `url("${card.image}")` }}>
            <span>{card.eyebrow}</span>
            <strong>{card.title}</strong>
          </article>
        ))}
      </section>

      <section className="final-layout">
        <article
          className="final-lead"
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(9, 7, 12, 0.94), rgba(9, 7, 12, 0.22)), url("${leadArticle.coverImage}")`,
          }}
        >
          <p>Главный материал</p>
          <h2>{leadArticle.title}</h2>
          <span>{leadArticle.excerpt}</span>
          <Link href={getArticleHref(leadArticle)}>Открыть материал</Link>
        </article>

        <section className="final-news">
          <h2>Сегодня в Viola</h2>
          {visibleLatestNews.map((item) => (
            <Link href={item.href} key={item.title}>
              <span>{item.category}</span>
              <strong>{item.title}</strong>
            </Link>
          ))}
        </section>

        <section className="final-club" aria-label="ACF Fiorentina">
          <img src="/images/club-logo.webp" alt="Fiorentina" />
          <div>
            <p>Club identity</p>
            <h2>ACF Fiorentina</h2>
            <span>Florence / Since 1926</span>
          </div>
          <Link href="/history">История клуба</Link>
        </section>

        <section className="final-newsroom">
          <div className="final-newsroom__head">
            <p>News desk</p>
            <h2>Новости и трансферы</h2>
            <Link href="/news">Все новости</Link>
          </div>
          <div className="final-newsroom__grid">
            <article
              className="final-headline"
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(9, 7, 12, 0.94), rgba(9, 7, 12, 0.18)), url("${leadArticle.coverImage}")`,
              }}
            >
              <span>Главная новость</span>
              <h3>{leadArticle.title}</h3>
              <p>{leadArticle.excerpt}</p>
              <Link href={getArticleHref(leadArticle)}>Открыть материал</Link>
            </article>

            <div className="final-briefs">
              {visibleBriefs.map((item) => (
                <Link href={item.href} key={item.title}>
                  <span>{item.category}</span>
                  <strong>{item.title}</strong>
                  <em>{item.meta}</em>
                </Link>
              ))}
            </div>

            <aside className="final-ad-slot">
              <div
                aria-hidden="true"
                className="final-ad-slot__image"
                style={{ backgroundImage: `url("${imageAssets.stadium}")` }}
              />
              <p>Partners</p>
              <h3>{settings.partnerTitle}</h3>
              <span>{settings.partnerText}</span>
              <Link href={settings.partnerHref}>{settings.partnerButtonLabel}</Link>
            </aside>
          </div>
        </section>

        <section
          className="final-curva"
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(9, 7, 12, 0.94), rgba(9, 7, 12, 0.2)), url("${home.fanImage}")`,
          }}
        >
          <ScarfIcon className="direction-icon" />
          <p>{home.fanEyebrow}</p>
          <h2>{home.fanTitle}</h2>
          <span>{home.fanText}</span>
          <Link href={telegramUrl}>В Telegram</Link>
        </section>

        <section className="final-fixtures">
          <div className="final-fixtures__head">
            <MatchIcon className="direction-icon" />
            <div>
              <p>Match line</p>
              <h2>Ближайшие матчи</h2>
            </div>
          </div>
          <div className="final-fixtures__list">
            {upcomingMatches.map((match) => (
              <Link href={getMatchHref(match)} key={match.slug}>
                <span>{match.kickoff}</span>
                <strong>
                  {match.homeTeam} <b>vs</b> {match.awayTeam}
                </strong>
                <em>
                  {match.competition} / {match.venue}
                </em>
              </Link>
            ))}
          </div>
          <Link className="final-fixtures__all" href="/matches">
            Весь календарь
          </Link>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}

function getHomeCategoryLabel(category: Exclude<NewsCategory, "all">) {
  const labels: Record<Exclude<NewsCategory, "all">, string> = {
    matches: "Матчи",
    transfers: "Трансферы",
    team: "Команда",
    history: "История",
    community: "Сообщество",
  };

  return labels[category];
}
