"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryNav, siteConfig } from "@/src/config/site";
import { useLocalContent } from "@/src/lib/local-content";

type SiteHeaderProps = {
  showAdmin?: boolean;
};

export function SiteHeader({ showAdmin = false }: SiteHeaderProps) {
  const pathname = usePathname();
  const { settings } = useLocalContent();
  const [isOpen, setIsOpen] = useState(false);
  const telegramUrl = settings.telegramUrl || siteConfig.telegramUrl;
  const navItems = showAdmin
    ? [...primaryNav, { label: "Админка", href: "/admin" }]
    : primaryNav;

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className={`site-header${isOpen ? " is-open" : ""}`}>
      <Link className="site-header__brand" href="/" onClick={() => setIsOpen(false)}>
        <span>{siteConfig.name}</span>
        <small>{siteConfig.disclaimer}</small>
      </Link>

      <nav aria-label="Основная навигация" className="site-header__nav">
        {navItems.map((item) => (
          <Link
            className={isActivePath(pathname, item.href) ? "site-header__link is-active" : "site-header__link"}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="site-header__actions">
        <Link className="site-header__telegram" href={telegramUrl}>
          Telegram
        </Link>
      </div>

      <button
        aria-controls="site-mobile-menu"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
        className="site-header__burger"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>

      <nav aria-label="Мобильная навигация" className="site-header__mobile" id="site-mobile-menu">
        {navItems.map((item) => (
          <Link
            className={isActivePath(pathname, item.href) ? "is-active" : ""}
            href={item.href}
            key={item.href}
            onClick={() => setIsOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link href={telegramUrl} onClick={() => setIsOpen(false)}>
          Telegram
        </Link>
      </nav>
    </header>
  );
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
