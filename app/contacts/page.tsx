import { InfoPage } from "@/src/components/ui/info-page";
import { imageAssets } from "@/src/data/assets";
import { siteConfig } from "@/src/config/site";

export default function ContactsPage() {
  return (
    <InfoPage
      eyebrow="Contacts"
      title="Контакты"
      description="Связь с Viola Community по новостям, материалам, партнёрству и предложениям от болельщиков."
      image={imageAssets.kitGroup}
      primaryHref={siteConfig.telegramUrl}
      primaryLabel="Написать в Telegram"
      cards={[
        {
          title: "Новости и источники",
          text: "Присылай важные темы, ссылки и уточнения, которые могут помочь редакции сделать материал точнее.",
        },
        {
          title: "Фанатские истории",
          text: "Фото, выезды, личные истории и атмосфера трибун могут стать отдельными материалами портала.",
        },
        {
          title: "Партнёрство",
          text: "Для рекламных и партнёрских размещений лучше сразу описать формат, сроки и контакт для связи.",
        },
      ]}
    />
  );
}
