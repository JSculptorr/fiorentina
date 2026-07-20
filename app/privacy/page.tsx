import { InfoPage } from "@/src/components/ui/info-page";
import { imageAssets } from "@/src/data/assets";

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Privacy"
      title="Политика конфиденциальности"
      description="Коротко о данных: портал можно читать без личного кабинета, а редакционные изменения сохраняются локально в браузере администратора."
      image={imageAssets.abstractStadium}
      primaryHref="/contacts"
      primaryLabel="Контакты"
      cards={[
        {
          title: "Чтение без входа",
          text: "Новости, календарь матчей и страницы портала доступны без регистрации и без сбора аккаунтов читателей.",
        },
        {
          title: "Локальная админка",
          text: "Материалы, созданные через админку, сохраняются в браузере и могут быть экспортированы в JSON.",
        },
        {
          title: "Внешние ссылки",
          text: "Telegram и партнёрские ссылки открывают внешние площадки, где действуют их собственные правила.",
        },
      ]}
    />
  );
}
