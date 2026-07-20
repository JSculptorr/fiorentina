import { InfoPage } from "@/src/components/ui/info-page";
import { imageAssets } from "@/src/data/assets";
import { siteConfig } from "@/src/config/site";

export default function PartnersPage() {
  return (
    <InfoPage
      eyebrow="Partners"
      title="Партнёры и реклама"
      description="Нативные форматы для проектов, которым близка футбольная, городская и фанатская аудитория Viola Community."
      image={imageAssets.stadium}
      primaryHref={siteConfig.telegramUrl}
      primaryLabel="Обсудить размещение"
      cards={[
        {
          title: "Нативный блок",
          text: "Аккуратное размещение в сайдбаре новостей или на главной без агрессивных баннеров.",
        },
        {
          title: "Редакционная подача",
          text: "Партнёрский материал можно оформить в стиле портала: фото, короткий текст, ссылка и понятный статус.",
        },
        {
          title: "Футбольная аудитория",
          text: "Формат подойдёт барам, магазинам, медиа, Telegram-проектам и локальным инициативам.",
        },
      ]}
    />
  );
}
