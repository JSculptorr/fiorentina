import { InfoPage } from "@/src/components/ui/info-page";
import { imageAssets } from "@/src/data/assets";

export default function HistoryPage() {
  return (
    <InfoPage
      eyebrow="Club history"
      title="История и легенды клуба"
      description="Раздел о Fiorentina как о части Флоренции: символы, важные матчи, сильные игроки и память болельщиков."
      image={imageAssets.stadium}
      primaryHref="/news?category=history"
      primaryLabel="Материалы истории"
      cards={[
        {
          title: "Флорентийская идентичность",
          text: "Клуб читается через город, цвет, стадион, трибуны и особую связь болельщиков с Viola.",
        },
        {
          title: "Матчи и сезоны",
          text: "Важные игры и поворотные моменты можно оформлять как отдельные редакционные материалы.",
        },
        {
          title: "Легенды Viola",
          text: "Игроки, тренеры и капитаны получают место в контексте истории, а не только в статистике.",
        },
      ]}
    />
  );
}
