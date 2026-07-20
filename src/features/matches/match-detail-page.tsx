"use client";

import Link from "next/link";
import { SiteFooter } from "@/src/components/layout/site-footer";
import { SiteHeader } from "@/src/components/layout/site-header";
import { type MatchEvent, type MatchItem } from "@/src/data/matches";
import { useLocalContent } from "@/src/lib/local-content";

type MatchDetailPageProps = {
  match: MatchItem;
};

export function MatchDetailPage({ match }: MatchDetailPageProps) {
  const { matches } = useLocalContent();
  const displayMatch = matches.find((item) => item.slug === match.slug) ?? match;
  const hasStats = displayMatch.stats.some((stat) => stat.home > 0 || stat.away > 0);

  return (
    <main className="match-detail-stage">
      <SiteHeader />

      <section
        className="match-detail-hero"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(9, 7, 12, 0.95), rgba(9, 7, 12, 0.25)), url("${displayMatch.coverImage}")`,
        }}
      >
        <p>{displayMatch.competition}</p>
        <div className="detail-scoreline">
          <strong>{displayMatch.homeTeam}</strong>
          <b>{displayMatch.score ?? "vs"}</b>
          <strong>{displayMatch.awayTeam}</strong>
        </div>
        <h1>{displayMatch.headline}</h1>
        <span>{displayMatch.summary}</span>
        <div className="detail-meta">
          <em>{displayMatch.round}</em>
          <em>{displayMatch.kickoff}</em>
          <em>{displayMatch.venue}</em>
        </div>
      </section>

      <section className="match-detail-grid">
        <aside className="match-action-card">
          <span>{displayMatch.status === "finished" ? "Матч в архиве" : "Матч скоро"}</span>
          <h2>{displayMatch.status === "finished" ? "Разбор матча" : "Перед игрой"}</h2>
          <p>
            {displayMatch.status === "finished"
              ? "События, статистика и связанные материалы после финального свистка."
              : `${displayMatch.round}. ${displayMatch.kickoff}. ${displayMatch.venue}.`}
          </p>
          <Link href="/news?category=matches">Читать материалы</Link>
        </aside>

        <section className="timeline-panel">
          <div className="panel-kicker">Timeline</div>
          <h2>События матча</h2>
          {displayMatch.events.map((event) => (
            <EventRow event={event} key={`${event.minute}-${event.text}`} />
          ))}
        </section>

        {hasStats ? (
          <section className="stats-panel">
            <div className="panel-kicker">Stats</div>
            <h2>Статистика</h2>
            {displayMatch.stats.map((stat) => (
              <div className="stat-row" key={stat.label}>
                <div>
                  <span>
                    {stat.home}
                    {stat.suffix ?? ""}
                  </span>
                  <strong>{stat.label}</strong>
                  <span>
                    {stat.away}
                    {stat.suffix ?? ""}
                  </span>
                </div>
                <div className="stat-bars" aria-hidden="true">
                  <i style={{ width: `${Math.max(stat.home, 4)}%` }} />
                  <i style={{ width: `${Math.max(stat.away, 4)}%` }} />
                </div>
              </div>
            ))}
          </section>
        ) : null}

        <section className="lineup-panel">
          <div className="panel-kicker">Squad notes</div>
          <h2>Состав и фокус</h2>
          {displayMatch.lineup.map((group) => (
            <article key={group.title}>
              <h3>{group.title}</h3>
              {group.players.map((player) => (
                <span key={player}>{player}</span>
              ))}
            </article>
          ))}
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}

function EventRow({ event }: { event: MatchEvent }) {
  return (
    <article className="event-row" data-event={event.type}>
      <span>{event.minute}</span>
      <strong>{event.team}</strong>
      <p>{event.text}</p>
    </article>
  );
}
