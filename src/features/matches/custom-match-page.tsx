"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/src/components/layout/site-header";
import { MatchDetailPage } from "@/src/features/matches/match-detail-page";
import { useLocalContent } from "@/src/lib/local-content";

export function CustomMatchPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const { matches, hydrated } = useLocalContent();
  const match = matches.find((item) => item.slug === slug);

  if (match) {
    return <MatchDetailPage match={match} />;
  }

  return (
    <main className="match-detail-stage">
      <SiteHeader />
      <section className="match-note local-article-empty">
        <div className="panel-kicker">Match center</div>
        <h1>{hydrated ? "Матч не найден" : "Загрузка матча"}</h1>
        <p>
          {hydrated
            ? "Этот матч не найден в локальной админке. Проверь slug или вернись к календарю."
            : "Сейчас проверяем локальные данные админки."}
        </p>
        <Link href="/matches">К календарю</Link>
      </section>
    </main>
  );
}
