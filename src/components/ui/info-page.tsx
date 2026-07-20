"use client";

import Link from "next/link";
import { SiteFooter } from "@/src/components/layout/site-footer";
import { SiteHeader } from "@/src/components/layout/site-header";
import { siteConfig } from "@/src/config/site";
import { imageAssets } from "@/src/data/assets";
import { useLocalContent } from "@/src/lib/local-content";

type InfoPageCard = {
  title: string;
  text: string;
};

type InfoPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  cards: InfoPageCard[];
  image?: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export function InfoPage({
  eyebrow,
  title,
  description,
  cards,
  image = imageAssets.fansFlags,
  primaryHref = "/news",
  primaryLabel = "К новостям",
}: InfoPageProps) {
  const { settings } = useLocalContent();
  const resolvedPrimaryHref =
    primaryHref === siteConfig.telegramUrl ? settings.telegramUrl : primaryHref;

  return (
    <main className="info-stage">
      <SiteHeader />

      <section
        className="info-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(9, 7, 12, 0.94), rgba(9, 7, 12, 0.58)), url("${image}")`,
        }}
      >
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{description}</span>
        <div>
          <Link href={resolvedPrimaryHref}>{primaryLabel}</Link>
          <Link href="/">Главная</Link>
        </div>
      </section>

      <section className="info-grid">
        {cards.map((card) => (
          <article key={card.title}>
            <span>{eyebrow}</span>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
          </article>
        ))}
      </section>

      <SiteFooter />
    </main>
  );
}
