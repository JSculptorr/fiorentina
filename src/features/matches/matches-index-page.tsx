"use client";

import Link from "next/link";
import { SiteFooter } from "@/src/components/layout/site-footer";
import { SiteHeader } from "@/src/components/layout/site-header";
import {
  matchSchedule,
  matchStatusLabels,
  matchStatusOrder,
  type MatchFilter,
  type MatchItem,
} from "@/src/data/matches";
import { getMatchHref, mergeMatches, useLocalContent } from "@/src/lib/local-content";

type MatchesIndexPageProps = {
  filter: MatchFilter;
};

export function MatchesIndexPage({ filter }: MatchesIndexPageProps) {
  const { matches: localMatches } = useLocalContent();
  const allMatches = mergeMatches(localMatches, matchSchedule);
  const featured =
    allMatches.find((match) => match.status === "upcoming") ?? allMatches[0] ?? matchSchedule[0];
  const matches =
    filter === "all" ? allMatches : allMatches.filter((match) => match.status === filter);
  const upcoming = allMatches.filter((match) => match.status === "upcoming").slice(0, 5);

  return (
    <main className="matches-stage">
      <SiteHeader />

      <section className="matches-hero">
        <div>
          <p>Match center</p>
          <h1>Матчи, календарь и результаты</h1>
          <span>
            Ближайшие игры, архив результатов, форма команды и быстрый переход
            к отдельному матч-центру.
          </span>
        </div>

        <FeaturedMatchCard match={featured} />
      </section>

      <nav className="match-filters" aria-label="Фильтр матчей">
        {matchStatusOrder.map((status) => (
          <Link
            className={status === filter ? "is-active" : ""}
            href={status === "all" ? "/matches" : `/matches?status=${status}`}
            key={status}
          >
            {matchStatusLabels[status]}
          </Link>
        ))}
      </nav>

      <section className="matches-grid">
        <div className="fixtures-panel">
          <div className="panel-kicker">Calendar</div>
          <h2>Календарь матчей</h2>
          {matches.length ? (
            matches.map((match) => <MatchRow match={match} key={match.slug} />)
          ) : (
            <div className="match-empty">
              <strong>Матчей нет</strong>
              <p>Сейчас в этом статусе нет матчей. Выбери другой фильтр.</p>
            </div>
          )}
        </div>

        <section className="upcoming-panel">
          <div className="panel-kicker">Next matches</div>
          <h2>Ближайшие матчи</h2>
          {upcoming.map((match) => (
            <Link href={getMatchHref(match)} key={match.slug}>
              <span>{match.kickoff}</span>
              <strong>
                {match.homeTeam} vs {match.awayTeam}
              </strong>
            </Link>
          ))}
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}

function FeaturedMatchCard({ match }: { match: MatchItem }) {
  return (
    <article
      className="featured-match"
      style={{
        backgroundImage: `linear-gradient(0deg, rgba(9, 7, 12, 0.94), rgba(9, 7, 12, 0.24)), url("${match.coverImage}")`,
      }}
    >
      <span>{match.competition}</span>
      <div className="scoreline">
        <strong>{match.homeTeam}</strong>
        <b>{match.score ?? "vs"}</b>
        <strong>{match.awayTeam}</strong>
      </div>
      <p>{match.headline}</p>
      <dl>
        <div>
          <dt>Старт</dt>
          <dd>{match.kickoff}</dd>
        </div>
        <div>
          <dt>Стадион</dt>
          <dd>{match.venue}</dd>
        </div>
      </dl>
      {match.countdown.length ? (
        <div className="match-countdown">
          {match.countdown.map((item) => (
            <em key={item}>{item}</em>
          ))}
        </div>
      ) : null}
      <Link href={getMatchHref(match)}>Открыть матч-центр</Link>
    </article>
  );
}

function MatchRow({ match }: { match: MatchItem }) {
  return (
    <Link className="match-row" href={getMatchHref(match)}>
      <div
        aria-hidden="true"
        className="match-row__image"
        style={{ backgroundImage: `url("${match.coverImage}")` }}
      />
      <div>
        <span>{match.resultLabel}</span>
        <strong>
          {match.homeTeam} <b>{match.score ?? "vs"}</b> {match.awayTeam}
        </strong>
        <p>{match.summary}</p>
        <em>
          {match.kickoff} / {match.venue}
        </em>
      </div>
    </Link>
  );
}
