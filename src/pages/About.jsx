import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./About.css";
import profileImg from "../assets/crumpycats.jpg";

// ── Skills data ──────────────────────────────────────────────────────────────
const SKILLS = [
  {
    category_key: "skills.cat.data",
    items: ["Python", "Pandas", "NumPy", "SQL", "R", "Excel"],
  },
  {
    category_key: "skills.cat.viz",
    items: ["Power BI", "Tableau", "D3.js", "Matplotlib", "Seaborn"],
  },
  {
    category_key: "skills.cat.ml",
    items: ["Scikit-learn", "TensorFlow", "NLP", "Regression", "Clustering"],
  },
  {
    category_key: "skills.cat.dev",
    items: ["React", "JavaScript", "Git", "REST APIs", "Figma"],
  },
];

const TIMELINE = [
  {
    year: "2024",
    title_key: "about.timeline.t1.title",
    desc_key: "about.timeline.t1.desc",
    type: "work",
  },
  {
    year: "2023",
    title_key: "about.timeline.t2.title",
    desc_key: "about.timeline.t2.desc",
    type: "edu",
  },
  {
    year: "2022",
    title_key: "about.timeline.t3.title",
    desc_key: "about.timeline.t3.desc",
    type: "work",
  },
  {
    year: "2020",
    title_key: "about.timeline.t4.title",
    desc_key: "about.timeline.t4.desc",
    type: "edu",
  },
];

// ── Animated counter ─────────────────────────────────────────────────────────
function useCounter(target, duration = 1400, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return val;
}

// ── Intersection observer hook ───────────────────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── Sub-components ───────────────────────────────────────────────────────────
function StatBadge({ value, suffix = "", label, active }) {
  const count = useCounter(value, 1200, active);
  return (
    <div className="about-stat">
      <span className="about-stat__num">
        {count}
        {suffix}
      </span>
      <span className="about-stat__label">{label}</span>
    </div>
  );
}

function SkillPill({ name, index }) {
  return (
    <span
      className="skill-pill"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {name}
    </span>
  );
}

function TimelineItem({ item, index, inView }) {
  const { t } = useTranslation();
  return (
    <div
      className={`tl-item tl-item--${item.type} ${inView ? "tl-item--visible" : ""}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="tl-item__year">{item.year}</div>
      <div className="tl-item__dot" />
      <div className="tl-item__body">
        <h4 className="tl-item__title">{t(item.title_key)}</h4>
        <p className="tl-item__desc">{t(item.desc_key)}</p>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function About() {
  const { t } = useTranslation();

  // Section observers
  const [heroRef, heroInView] = useInView(0.1);
  const [statsRef, statsInView] = useInView(0.3);
  const [skillsRef, skillsInView] = useInView(0.15);
  const [tlRef, tlInView] = useInView(0.1);
  const [valuesRef, valuesInView] = useInView(0.2);

  // Scroll progress bar
  const [scroll, setScroll] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setScroll(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="about-page">
      {/* scroll progress */}
      <div className="scroll-bar" style={{ width: `${scroll}%` }} />

      {/* ── HERO ── */}
      <section className="about-hero" ref={heroRef}>
        <div className={`about-hero__inner ${heroInView ? "fade-up" : ""}`}>
          <div className="about-hero__label">{t("about.label")}</div>
          <h1 className="about-hero__heading">
            {t("about.heading.line1")}
            <br />
            <em className="accent">{t("about.heading.line2")}</em>
          </h1>
          <p className="about-hero__sub">{t("about.intro")}</p>
        </div>

        {/* decorative grid lines */}
        <div className="grid-lines" aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="grid-line" />
          ))}
        </div>
      </section>

      {/* ── BIO ── */}
      <section className="about-bio">
        <div className="container about-bio__grid">
          <div className="about-bio__portrait">
            <div className="portrait-frame">
              {/* Replace src with your actual photo */}
              <div className="about-bio__portrait">
        <div className="portrait-frame">
    <img
      src={profileImg}
      alt="Marily"
      className="portrait-placeholder"
          />
        <div className="portrait-frame__border" />
        </div>
        <div className="portrait-tag">{t("about.portrait_tag")}</div>
        </div>
              <div className="portrait-frame__border" />
            </div>
            <div className="portrait-tag">{t("about.portrait_tag")}</div>
          </div>
           
          <div className="about-bio__text">
            <h2 className="section-heading">{t("about.bio.heading")}</h2>
            <p>{t("about.bio.p1")}</p>
            <p>{t("about.bio.p2")}</p>
            <p>{t("about.bio.p3")}</p>

            <a href="/contact" className="cta-link">
              {t("about.bio.cta")}
              <span className="cta-link__arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="about-stats" ref={statsRef}>
        <div className="container about-stats__row">
          <StatBadge value={30} suffix="+" label={t("about.stats.projects")} active={statsInView} />
          <StatBadge value={5}  suffix="+"  label={t("about.stats.years")}    active={statsInView} />
          <StatBadge value={12} suffix=""   label={t("about.stats.certs")}    active={statsInView} />
          <StatBadge value={8}  suffix=""   label={t("about.stats.tools")}    active={statsInView} />
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section className="about-skills" ref={skillsRef}>
        <div className="container">
          <h2 className={`section-heading ${skillsInView ? "fade-up" : ""}`}>
            {t("about.skills.heading")}
          </h2>
          <div className="skills-grid">
            {SKILLS.map((cat, ci) => (
              <div
                key={ci}
                className={`skill-cat ${skillsInView ? "fade-up" : ""}`}
                style={{ animationDelay: `${ci * 100}ms` }}
              >
                <h3 className="skill-cat__name">{t(cat.category_key)}</h3>
                <div className="skill-cat__pills">
                  {cat.items.map((name, pi) => (
                    <SkillPill key={name} name={name} index={pi} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="about-timeline" ref={tlRef}>
        <div className="container">
          <h2 className={`section-heading ${tlInView ? "fade-up" : ""}`}>
            {t("about.timeline.heading")}
          </h2>
          <div className="tl-track">
            {TIMELINE.map((item, i) => (
              <TimelineItem key={i} item={item} index={i} inView={tlInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="about-values" ref={valuesRef}>
        <div className="container">
          <h2 className={`section-heading ${valuesInView ? "fade-up" : ""}`}>
            {t("about.values.heading")}
          </h2>
          <div className="values-grid">
            {["clarity", "curiosity", "craft"].map((v, i) => (
              <div
                key={v}
                className={`value-card ${valuesInView ? "fade-up" : ""}`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="value-card__num">0{i + 1}</div>
                <h3 className="value-card__title">{t(`about.values.${v}.title`)}</h3>
                <p className="value-card__desc">{t(`about.values.${v}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}