import { MatchesIndexPage } from "@/src/features/matches/matches-index-page";
import { matchStatusOrder, type MatchFilter } from "@/src/data/matches";

export const metadata = {
  title: "Матчи и результаты | Viola Community",
  description:
    "Календарь матчей, ближайшая игра и матч-центр фанатского портала Fiorentina.",
};

type MatchesPageProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

export default async function MatchesPage({ searchParams }: MatchesPageProps) {
  const params = await searchParams;
  const rawStatus = params?.status;
  const filter = matchStatusOrder.includes(rawStatus as MatchFilter)
    ? (rawStatus as MatchFilter)
    : "all";

  return <MatchesIndexPage filter={filter} />;
}
