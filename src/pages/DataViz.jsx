import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./DataViz.css";

const GITHUB_USER = "marily77";
const API = "https://api.github.com";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getLangColor(lang) {
  const map = {
    Python: "#e8ff6b",
    Jupyter: "#e8ff6b99",
    R: "#c8c4bc",
    JavaScript: "#f0c040",
    TypeScript: "#4c8eda",
    SQL: "#a78bfa",
    HTML: "#f97316",
    CSS: "#38bdf8",
    Shell: "#22d3ee",
    Java: "#fb923c",
    "C++": "#ec4899",
  };
  return map[lang] || "#444";
}

function buildActivityGrid(events) {
  const grid = {};
  const now = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    grid[key] = 0;
  }
  events.forEach((e) => {
    const key = e.created_at?.slice(0, 10);
    if (key && grid[key] !== undefined) grid[key]++;
  });
  return grid;
}

function getWeeks(grid) {
  const days = Object.entries(grid);
  const weeks = [];
  let week = [];
  days.forEach(([date, count], i) => {
    const dow = new Date(date).getDay();
    if (i === 0 && dow !== 0) {
      for (let p = 0; p < dow; p++) week.push(null);
    }
    week.push({ date, count });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length > 0) weeks.push(week);
  return weeks;
}

function ActivityCell({ day, max }) {
  if (!day) return <div className="dv-cell dv-cell--empty" />;
  const intensity = max > 0 ? day.count / max : 0;
  let level = 0;
  if (intensity > 0.75) level = 4;
  else if (intensity > 0.5) level = 3;
  else if (intensity > 0.25) level = 2;
  else if (intensity > 0) level = 1;
  return (
    <div
      className={`dv-cell dv-cell--${level}`}
      title={`${day.date}: ${day.count} events`}
    />
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function DataViz() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // derived
  const [langTotals, setLangTotals] = useState({});
  const [activityGrid, setActivityGrid] = useState({});
  const [topRepos, setTopRepos] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [maxActivity, setMaxActivity] = useState(1);

  const canvasRef = useRef(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);
        const headers = { Accept: "application/vnd.github+json" };

        const [profileRes, reposRes, eventsRes] = await Promise.all([
          fetch(`${API}/users/${GITHUB_USER}`, { headers }),
          fetch(`${API}/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, { headers }),
          fetch(`${API}/users/${GITHUB_USER}/events/public?per_page=100`, { headers }),
        ]);

        if (!profileRes.ok) throw new Error(`GitHub API: ${profileRes.status}`);

        const profileData = await profileRes.json();
        const reposData = reposRes.ok ? await reposRes.json() : [];
        const eventsData = eventsRes.ok ? await eventsRes.json() : [];

        setProfile(profileData);
        setRepos(reposData);
        setEvents(eventsData);

        // Repos sorted by stars for top-3
        const sorted = [...reposData].sort(
          (a, b) => b.stargazers_count - a.stargazers_count
        );
        setTopRepos(sorted.slice(0, 5));

        // Language totals (aggregate bytes across all repos)
        const langMap = {};
        await Promise.all(
          reposData.slice(0, 30).map(async (repo) => {
            if (repo.fork) return;
            try {
              const lr = await fetch(repo.languages_url, { headers });
              if (!lr.ok) return;
              const langs = await lr.json();
              Object.entries(langs).forEach(([lang, bytes]) => {
                langMap[lang] = (langMap[lang] || 0) + bytes;
              });
            } catch {}
          })
        );
        setLangTotals(langMap);

        // Activity grid
        const grid = buildActivityGrid(eventsData);
        setActivityGrid(grid);
        const mx = Math.max(...Object.values(grid), 1);
        setMaxActivity(mx);

        // Category breakdown (by topic / language heuristic)
        const cats = {};
        reposData.forEach((r) => {
          if (r.fork) return;
          const lang = r.language || "Other";
          cats[lang] = (cats[lang] || 0) + 1;
        });
        const catArr = Object.entries(cats)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 7);
        setCategoryData(catArr);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // ── Draw donut on canvas ──────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || Object.keys(langTotals).length === 0) return;
    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const outer = size * 0.42;
    const inner = size * 0.26;

    const entries = Object.entries(langTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    const total = entries.reduce((s, [, v]) => s + v, 0);

    ctx.clearRect(0, 0, size, size);

    let angle = -Math.PI / 2;
    entries.forEach(([lang, bytes]) => {
      const slice = (bytes / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outer, angle, angle + slice);
      ctx.closePath();
      ctx.fillStyle = getLangColor(lang);
      ctx.fill();
      angle += slice;
    });

    // Donut hole
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.fillStyle = "#0e0e0e";
    ctx.fill();

    // Center text
    ctx.fillStyle = "#e8ff6b";
    ctx.font = `bold ${size * 0.08}px 'Syne', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(entries[0]?.[0] || "", cx, cy - size * 0.04);
    ctx.fillStyle = "#c8c4bc";
    ctx.font = `${size * 0.055}px 'DM Mono', monospace`;
    ctx.fillText("top lang", cx, cy + size * 0.06);
  }, [langTotals]);

  // ── UI ───────────────────────────────────────────────────────────────────

  const totalBytes = Object.values(langTotals).reduce((s, v) => s + v, 0);
  const weeks = getWeeks(activityGrid);
  const totalEvents = Object.values(activityGrid).reduce((s, v) => s + v, 0);
  const originalRepos = repos.filter((r) => !r.fork);

  return (
    <main className="dv-page">
      <div className="dv-header">
        <span className="dv-eyebrow">github / {GITHUB_USER}</span>
        <h1 className="dv-title">
          {t("dataviz.title", "Data")} <span className="dv-accent">Viz</span>
        </h1>
        <p className="dv-subtitle">
          {t(
            "dataviz.subtitle",
            "Live GitHub statistika — keeled, aktiivsus, repod"
          )}
        </p>
      </div>

      {loading && (
        <div className="dv-loading">
          <span className="dv-spinner" />
          <span>{t("dataviz.loading", "Laen GitHub andmeid...")}</span>
        </div>
      )}

      {error && (
        <div className="dv-error">
          <span>⚠ API viga: {error}</span>
          <p>GitHub rate limit võib olla täis. Proovi mõne minuti pärast.</p>
        </div>
      )}

      {!loading && !error && profile && (
        <>
          {/* ── Stats row ── */}
          <section className="dv-stats-row">
            {[
              { label: t("dataviz.repos", "Repod"), value: profile.public_repos },
              { label: t("dataviz.originals", "Originaalid"), value: originalRepos.length },
              {
                label: t("dataviz.stars", "Tähed"),
                value: repos.reduce((s, r) => s + r.stargazers_count, 0),
              },
              { label: t("dataviz.events", "Events / aasta"), value: totalEvents },
            ].map((s) => (
              <div className="dv-stat" key={s.label}>
                <span className="dv-stat__num">{s.value}</span>
                <span className="dv-stat__label">{s.label}</span>
              </div>
            ))}
          </section>

          {/* ── Two column: donut + bar chart ── */}
          <section className="dv-two-col">
            {/* Donut */}
            <div className="dv-card dv-card--dark">
              <h2 className="dv-card__title">
                {t("dataviz.languages", "Keelejaotus")}
              </h2>
              <div className="dv-donut-wrap">
                <canvas
                  ref={canvasRef}
                  className="dv-donut-canvas"
                  width={220}
                  height={220}
                />
              </div>
              <ul className="dv-lang-legend">
                {Object.entries(langTotals)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 8)
                  .map(([lang, bytes]) => {
                    const pct = totalBytes
                      ? ((bytes / totalBytes) * 100).toFixed(1)
                      : 0;
                    return (
                      <li key={lang} className="dv-lang-item">
                        <span
                          className="dv-lang-dot"
                          style={{ background: getLangColor(lang) }}
                        />
                        <span className="dv-lang-name">{lang}</span>
                        <span className="dv-lang-pct">{pct}%</span>
                      </li>
                    );
                  })}
              </ul>
            </div>

            {/* Bar chart: category count */}
            <div className="dv-card dv-card--dark">
              <h2 className="dv-card__title">
                {t("dataviz.byLanguage", "Repod keele järgi")}
              </h2>
              <div className="dv-bars">
                {categoryData.map(([lang, count]) => {
                  const maxCount = categoryData[0]?.[1] || 1;
                  const w = Math.round((count / maxCount) * 100);
                  return (
                    <div className="dv-bar-row" key={lang}>
                      <span className="dv-bar-label">{lang}</span>
                      <div className="dv-bar-track">
                        <div
                          className="dv-bar-fill"
                          style={{
                            width: `${w}%`,
                            background: getLangColor(lang),
                          }}
                        />
                      </div>
                      <span className="dv-bar-count">{count}</span>
                    </div>
                  );
                })}
              </div>

              {/* Top repos */}
              <h2 className="dv-card__title" style={{ marginTop: "2rem" }}>
                {t("dataviz.topRepos", "Top repod")}
              </h2>
              <ul className="dv-top-repos">
                {topRepos.map((repo) => (
                  <li key={repo.id} className="dv-repo-item">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dv-repo-name"
                    >
                      {repo.name}
                    </a>
                    <span className="dv-repo-meta">
                      {repo.language && (
                        <span
                          className="dv-repo-lang"
                          style={{ color: getLangColor(repo.language) }}
                        >
                          {repo.language}
                        </span>
                      )}
                      <span className="dv-repo-stars">
                        ★ {repo.stargazers_count}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── Activity heatmap ── */}
          <section className="dv-card dv-card--dark dv-heatmap-card">
            <h2 className="dv-card__title">
              {t("dataviz.activity", "GitHub aktiivsus — viimased 365 päeva")}
            </h2>
            <div className="dv-heatmap-scroll">
              <div className="dv-heatmap">
                {weeks.map((week, wi) => (
                  <div className="dv-week" key={wi}>
                    {week.map((day, di) => (
                      <ActivityCell key={di} day={day} max={maxActivity} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="dv-heatmap-legend">
              <span>{t("dataviz.less", "Vähem")}</span>
              {[0, 1, 2, 3, 4].map((l) => (
                <div key={l} className={`dv-cell dv-cell--${l}`} />
              ))}
              <span>{t("dataviz.more", "Rohkem")}</span>
            </div>
          </section>

          {/* ── Recent repos grid ── */}
          <section className="dv-section">
            <h2 className="dv-section__title">
              {t("dataviz.recentRepos", "Viimati uuendatud repod")}
            </h2>
            <div className="dv-repo-grid">
              {repos
                .filter((r) => !r.fork)
                .slice(0, 12)
                .map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dv-repo-card"
                  >
                    <span className="dv-repo-card__name">{repo.name}</span>
                    {repo.description && (
                      <span className="dv-repo-card__desc">
                        {repo.description.slice(0, 72)}
                        {repo.description.length > 72 ? "…" : ""}
                      </span>
                    )}
                    <div className="dv-repo-card__footer">
                      {repo.language && (
                        <span
                          className="dv-repo-card__lang"
                          style={{ color: getLangColor(repo.language) }}
                        >
                          ● {repo.language}
                        </span>
                      )}
                      <span className="dv-repo-card__stars">
                        ★ {repo.stargazers_count}
                      </span>
                    </div>
                  </a>
                ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}