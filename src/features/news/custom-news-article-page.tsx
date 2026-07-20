"use client";

import Link from "next/link";
import { baseNews } from "@/src/data/news";
import { mergeArticles, useLocalContent } from "@/src/lib/local-content";
import { NewsArticlePage } from "@/src/features/news/news-article-page";

type CustomNewsArticlePageProps = {
  slug: string;
};

export function CustomNewsArticlePage({ slug }: CustomNewsArticlePageProps) {
  const { articles, hydrated } = useLocalContent();
  const allArticles = mergeArticles(articles, baseNews);
  const article = allArticles.find((item) => item.slug === slug);

  if (!hydrated) {
    return (
      <main className="article-stage">
        <section className="news-empty local-article-empty">
          <h1>Открываем материал</h1>
          <p>Сайт проверяет локальные новости на этом устройстве.</p>
        </section>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="article-stage">
        <section className="news-empty local-article-empty">
          <h1>Материал не найден</h1>
          <p>Эта новость могла быть удалена из локальной админки или создана на другом устройстве.</p>
          <Link href="/admin">Открыть админку</Link>
          <Link href="/news">Все новости</Link>
        </section>
      </main>
    );
  }

  return <NewsArticlePage article={article} articles={allArticles} />;
}
