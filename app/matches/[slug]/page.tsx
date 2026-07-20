import { notFound } from "next/navigation";
import { getMatchBySlug, matchSchedule } from "@/src/data/matches";
import { MatchDetailPage } from "@/src/features/matches/match-detail-page";

type MatchPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return matchSchedule.map((match) => ({
    slug: match.slug,
  }));
}

export async function generateMetadata({ params }: MatchPageProps) {
  const { slug } = await params;
  const match = getMatchBySlug(slug);

  return {
    title: match
      ? `${match.homeTeam} vs ${match.awayTeam} | Viola Community`
      : "Матч не найден | Viola Community",
    description: match?.summary ?? "Страница match-center не найдена.",
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { slug } = await params;
  const match = getMatchBySlug(slug);

  if (!match) {
    notFound();
  }

  return <MatchDetailPage match={match} />;
}
