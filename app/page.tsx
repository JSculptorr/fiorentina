import type { Metadata } from "next";
import { HomePage } from "@/src/features/home/home-page";

export const metadata: Metadata = {
  title: "Viola Community | Главная",
  description:
    "Независимое сообщество болельщиков ACF Fiorentina: новости, матчи, трансферы и Telegram.",
};

export default function Home() {
  return <HomePage />;
}
