import type { Metadata } from "next";
import { CustomNewsArticlePage } from "@/src/features/news/custom-news-article-page";

export const metadata: Metadata = {
  title: "Локальная новость | Viola Community",
  description: "Материал, добавленный через локальную админку Viola Community.",
};

type CustomNewsPageProps = {
  searchParams?: Promise<{
    slug?: string;
  }>;
};

export default async function CustomNewsPage({ searchParams }: CustomNewsPageProps) {
  const params = (await searchParams) ?? {};

  return <CustomNewsArticlePage slug={params.slug ?? ""} />;
}
