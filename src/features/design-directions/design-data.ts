import type { ComponentType } from "react";
import { MatchIcon, ScarfIcon, SendIcon, StadiumIcon, TrophyIcon } from "@/src/components/ui/fan-icons";

export const directionCards: Array<{
  title: string;
  text: string;
  href: string;
  Icon: ComponentType<{ className?: string }>;
}> = [
  {
    title: "Матч дня",
    text: "Ближайшая игра всегда видна первой, без поиска по меню.",
    href: "/matches",
    Icon: MatchIcon,
  },
  {
    title: "Новости",
    text: "Редакционная лента, трансферы и материалы сообщества в одном быстром разделе.",
    href: "/news",
    Icon: ScarfIcon,
  },
  {
    title: "Трансферы",
    text: "Радар слухов и интереса с честной пометкой надёжности источников.",
    href: "/news?category=transfers",
    Icon: TrophyIcon,
  },
  {
    title: "Telegram",
    text: "Переход к живому обсуждению остаётся одним из главных действий.",
    href: "https://t.me/",
    Icon: SendIcon,
  },
];

export const coreIcons = {
  StadiumIcon,
  TrophyIcon,
  MatchIcon,
  ScarfIcon,
  SendIcon,
};
