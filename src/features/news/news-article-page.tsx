"use client";

import Link from "next/link";
import { SiteFooter } from "@/src/components/layout/site-footer";
import { SiteHeader } from "@/src/components/layout/site-header";
import { getRelatedArticles, newsCategories, type NewsArticle } from "@/src/data/news";
import { getArticleHref } from "@/src/lib/local-content";

type NewsArticlePageProps = {
  article: NewsArticle;
  articles?: NewsArticle[];
};

export function NewsArticlePage({ article, articles }: NewsArticlePageProps) {
  const related = getRelatedArticles(article, articles);
  const category = newsCategories.find((item) => item.value === article.category)?.label;

  return (
    <main className="article-stage">
      <SiteHeader />

      <article className="article-shell">
        <section
          className="article-hero"
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(9, 7, 12, 0.94), rgba(9, 7, 12, 0.22)), url("${article.coverImage}")`,
          }}
        >
          <p>{category}</p>
          <h1>{article.title}</h1>
          <span>{article.excerpt}</span>
          <div>
            <em>{article.author}</em>
            <em>{article.publishedAt}</em>
            <em>{article.readTime}</em>
            <em>{article.views} просмотров</em>
          </div>
        </section>

        <section className="article-body">
          <aside>
            <p>Share</p>
            <Link href="https://t.me/">Telegram</Link>
            {article.sourceUrl ? (
              <Link href={article.sourceUrl}>{article.sourceLabel ?? "Источник"}</Link>
            ) : null}
            <Link href="/news">Все новости</Link>
          </aside>
          <div>
            {article.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      </article>

      <section className="related-news">
        <h2>Связанные материалы</h2>
        <div>
          {related.map((item) => (
            <Link
              href={getArticleHref(item)}
              key={item.slug}
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(9, 7, 12, 0.94), rgba(9, 7, 12, 0.22)), url("${item.coverImage}")`,
              }}
            >
              <span>{item.readTime}</span>
              <strong>{item.title}</strong>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
