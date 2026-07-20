"use client";

import Link from "next/link";
import { primaryNav, siteConfig } from "@/src/config/site";
import { useLocalContent } from "@/src/lib/local-content";

const footerSections = [
  {
    title: "Портал",
    links: primaryNav,
  },
  {
    title: "Разделы",
    links: [
      { label: "Фан-материалы", href: "/fan-materials" },
      { label: "Партнёрам", href: "/partners" },
      { label: "Политика", href: "/privacy" },
    ],
  },
];

export function SiteFooter() {
  const { home, settings } = useLocalContent();
  const telegramUrl = settings.telegramUrl || siteConfig.telegramUrl;

  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <div>
          <p>Viola Community</p>
          <h2>{home.footerTitle}</h2>
        </div>
        <img src="/images/club-logo.webp" alt="ACF Fiorentina" />
      </div>

      <div className="site-footer__grid">
        <section className="site-footer__about">
          <span>{siteConfig.disclaimer}</span>
          <p>{home.footerText}</p>
          <Link href={telegramUrl}>Telegram канал</Link>
        </section>

        {footerSections.map((section) => (
          <nav aria-label={section.title} className="site-footer__links" key={section.title}>
            <p>{section.title}</p>
            {section.links.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        ))}

        <section className="site-footer__status">
          <p>Match desk</p>
          <strong>{home.footerStatusText}</strong>
          <Link href="/matches">Открыть календарь</Link>
        </section>
      </div>

      <div className="site-footer__bottom">
        <span>Independent fan community / Not official club website</span>
        <span>Florence spirit / Since 1926</span>
      </div>
    </footer>
  );
}
