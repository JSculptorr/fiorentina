import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Viola Community | Независимое сообщество болельщиков ACF Fiorentina",
  description:
    "Фанатский портал о Фиорентине: новости, матчи, трансферы и Telegram-сообщество.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Viola Community",
    description:
      "Независимое сообщество болельщиков ACF Fiorentina: новости, матчи и трансферы.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
