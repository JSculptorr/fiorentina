import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsArticlePage } from "@/src/features/news/news-article-page";
import { baseNews, getArticleBySlug } from "@/src/data/news";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  return {
    title: `${article?.title ?? "Новость"} | Viola Community`,
    description: article?.excerpt,
  };
}

export function generateStaticParams() {
  return baseNews.map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <NewsArticlePage article={article} />;
}
