"use client";

import Link from "next/link";
import { SiteFooter } from "@/src/components/layout/site-footer";
import { SiteHeader } from "@/src/components/layout/site-header";
import {
  baseNews,
  filterArticleList,
  filterNews,
  newsCategories,
  type NewsCategory,
} from "@/src/data/news";
import { imageAssets } from "@/src/data/assets";
import { getArticleHref, mergeArticles, useLocalContent } from "@/src/lib/local-content";

type NewsIndexPageProps = {
  category: NewsCategory;
  query: string;
};

export function NewsIndexPage({ category, query }: NewsIndexPageProps) {
  const { articles: localArticles, settings } = useLocalContent();
  const telegramUrl = settings.telegramUrl;
  const allArticles =
    localArticles.length > 0 ? mergeArticles(localArticles, baseNews) : filterNews("all", "");
  const articles = filterArticleList(allArticles, category, query);
  const featured = articles.find((article) => article.featured) ?? articles[0];
  const list = articles.filter((article) => article.slug !== featured?.slug);

  return (
    <main className="news-stage">
      <SiteHeader />
      <section className="news-hero">
        <div>
          <p>Viola news desk</p>
          <h1>Новости, трансферы и фанатский контекст</h1>
          <span>
            Лента для быстрых новостей, трансферных обновлений, матчевых материалов
            и историй вокруг Fiorentina.
          </span>
        </div>
        <form className="news-search" action="/news">
          <label htmlFor="news-search">Поиск по новостям</label>
          <input
            defaultValue={query}
            id="news-search"
            name="q"
            placeholder="Матч, трансфер, команда..."
            type="search"
          />
          {category !== "all" ? <input name="category" type="hidden" value={category} /> : null}
          <button type="submit">Найти</button>
        </form>
      </section>

      <nav className="news-categories" aria-label="Категории новостей">
        {newsCategories.map((item) => {
          const href =
            item.value === "all"
              ? query
                ? `/news?q=${encodeURIComponent(query)}`
                : "/news"
              : `/news?category=${item.value}${query ? `&q=${encodeURIComponent(query)}` : ""}`;

          return (
            <Link
              className={item.value === category ? "is-active" : ""}
              href={href}
              key={item.value}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <section className="news-layout">
        {featured ? (
          <article
            className="news-featured"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(9, 7, 12, 0.94), rgba(9, 7, 12, 0.18)), url("${featured.coverImage}")`,
            }}
          >
            <p>{getCategoryLabel(featured.category)} / главная</p>
            <h2>{featured.title}</h2>
            <span>{featured.excerpt}</span>
            <div>
              <em>{featured.author}</em>
              <em>{featured.readTime}</em>
              <em>{featured.views}</em>
            </div>
            <Link href={getArticleHref(featured)}>Читать материал</Link>
          </article>
        ) : (
          <div className="news-empty">
            <h2>Материалы не найдены</h2>
            <p>Попробуй убрать поиск или выбрать другую категорию.</p>
            <Link href="/news">Сбросить фильтры</Link>
          </div>
        )}

        <div className="news-listing">
          {list.map((article) => (
            <Link className="news-row" href={getArticleHref(article)} key={article.slug}>
              <div
                aria-hidden="true"
                className="news-row__image"
                style={{ backgroundImage: `url("${article.coverImage}")` }}
              />
              <div>
                <span>{getCategoryLabel(article.category)}</span>
                <strong>{article.title}</strong>
                <p>{article.excerpt}</p>
                <em>
                  {article.publishedAt} / {article.readTime}
                </em>
              </div>
            </Link>
          ))}
        </div>

        <aside className="news-ad-panel">
          <p>Partner</p>
          <h2>{settings.partnerTitle}</h2>
          <div
            aria-hidden="true"
            className="news-ad-panel__image"
            style={{ backgroundImage: `url("${imageAssets.stadium}")` }}
          />
          <strong>Нативное размещение для футбольной аудитории</strong>
          <span>{settings.partnerText}</span>
          <Link href={settings.partnerHref}>{settings.partnerButtonLabel}</Link>
        </aside>

        <aside className="news-channel-panel">
          <p>Telegram source</p>
          <h2>Живая лента сообщества</h2>
          <span>
            Быстрые новости, трансферные заметки и обсуждения остаются в канале, а на сайте
            собираются в аккуратную ленту.
          </span>
          <Link href={telegramUrl}>Открыть канал</Link>
        </aside>
      </section>

      <SiteFooter />
    </main>
  );
}

function getCategoryLabel(category: NewsCategory) {
  return newsCategories.find((item) => item.value === category)?.label ?? "Новости";
}
