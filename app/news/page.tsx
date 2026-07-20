import type { Metadata } from "next";
import { NewsIndexPage } from "@/src/features/news/news-index-page";
import { newsCategories, type NewsCategory } from "@/src/data/news";

export const metadata: Metadata = {
  title: "Новости | Viola Community",
  description:
    "Новости, трансферы, матчи и материалы независимого сообщества болельщиков ACF Fiorentina.",
};

type NewsPageProps = {
  searchParams?: Promise<{
    category?: string;
    q?: string;
  }>;
};

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = (await searchParams) ?? {};
  const category = normalizeCategory(params.category);
  const query = params.q ?? "";

  return <NewsIndexPage category={category} query={query} />;
}

function normalizeCategory(value: string | undefined): NewsCategory {
  const allowed = new Set(newsCategories.map((item) => item.value));
  return allowed.has(value as NewsCategory) ? (value as NewsCategory) : "all";
}
