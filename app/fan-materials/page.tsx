import { InfoPage } from "@/src/components/ui/info-page";
import { imageAssets } from "@/src/data/assets";
import { siteConfig } from "@/src/config/site";

export default function FanMaterialsPage() {
  return (
    <InfoPage
      eyebrow="Fan materials"
      title="Фанатские материалы"
      description="Фото, тексты, баннеры, выезды и личные истории болельщиков Fiorentina в одном редакционном разделе."
      image={imageAssets.fansFlags}
      primaryHref={siteConfig.telegramUrl}
      primaryLabel="Предложить материал"
      cards={[
        {
          title: "Фото и атмосфера",
          text: "Сильные кадры стадиона, формы, трибун и фанатских встреч помогают порталу выглядеть живым.",
        },
        {
          title: "Личные истории",
          text: "Почему человек стал болельщиком Fiorentina, какой матч запомнил и что для него значит Viola.",
        },
        {
          title: "Редакционный отбор",
          text: "Материалы можно оформлять через админку как новости или отдельные статьи сообщества.",
        },
      ]}
    />
  );
}
