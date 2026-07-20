import { InfoPage } from "@/src/components/ui/info-page";
import { imageAssets } from "@/src/data/assets";
import { siteConfig } from "@/src/config/site";

export default function AboutPage() {
  return (
    <InfoPage
      eyebrow="Community"
      title="О нашем сообществе"
      description="Viola Community собирает русскоязычных болельщиков Fiorentina вокруг новостей, матчей, трансферов и живого обсуждения клуба."
      image={imageAssets.fansFlags}
      primaryHref={siteConfig.telegramUrl}
      primaryLabel="В Telegram"
      cards={[
        {
          title: "Редакционный ритм",
          text: "Главные новости, трансферные заметки и материалы вокруг матчей собираются в одной понятной ленте.",
        },
        {
          title: "Фанатский взгляд",
          text: "Мы пишем не только про факты, но и про контекст: эмоции, атмосферу, решения клуба и реакцию болельщиков.",
        },
        {
          title: "Без сложного входа",
          text: "Портал можно читать сразу: новости, календарь, история клуба и ссылки на живое обсуждение доступны без регистрации.",
        },
      ]}
    />
  );
}
