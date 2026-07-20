import { CustomMatchPage } from "@/src/features/matches/custom-match-page";

export const metadata = {
  title: "Матч из админки | Viola Community",
  description: "Локальный match-center, созданный через админку Viola Community.",
};

export default function MatchCustomPage() {
  return <CustomMatchPage />;
}
