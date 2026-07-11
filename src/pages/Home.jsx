import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ParticleCloud from '../components/ParticleCloud'
import './Home.css'
import { useEffect, useRef, useState } from 'react'
import CertificatesModal from '../components/CertificatesModal'
import FeaturedWork from '../components/FeaturedWork'

// ── Animated counter (same pattern as About.jsx) ──────────────────────────
function useCounter(target, duration = 1400, active = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.floor(p * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, duration])
  return val
}

function useInView(threshold = 0.3) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function Home() {
  const { t } = useTranslation()
  const [certsOpen, setCertsOpen] = useState(false)
  const [statsRef, statsInView] = useInView(0.3)

  const certsCount = useCounter(31, 1200, statsInView)
  const projectsCount = useCounter(25, 1200, statsInView)
  const experienceCount = useCounter(22, 1200, statsInView)
  const toolsCount = useCounter(8, 1200, statsInView)

  return (
    <main className="home">
      <ParticleCloud />

      <p className="section-label">// Creative Technologist</p>

      <h1 className="hero-title">
        {t('home.greeting')}<br />
        <span className="accent">Marily.</span>
      </h1>

      <p className="role-line">
        <span>Python</span> · React · <span>Data Visualisation</span> · Design
      </p>

      <div className="cta-row">
        <Link to="/projects" className="btn btn-accent">{t('home.cta')} →</Link>
        <a href="https://github.com/marily77" target="_blank" rel="noreferrer" className="btn">GitHub ↗</a>
      </div>

      <div className="stats-row" ref={statsRef}>
        <button
          className="stat-item stat-clickable"
          onClick={() => setCertsOpen(true)}
          aria-label="Vaata sertifikaate"
        >
          <div className="stat-num">{certsCount}+</div>
          <div className="stat-label">{t('home.certificates', 'sertifikaati')}</div>
          <span className="stat-hint">{t('home.viewHint', 'vaata ↗')}</span>
        </button>

        
        <a href="https://github.com/marily77"
          target="_blank"
          rel="noreferrer"
          className="stat-item stat-clickable"
        >
          <div className="stat-num">{projectsCount}+</div>
          <div className="stat-label">projekti GitHubis</div>
          <span className="stat-hint">{t('home.viewHint', 'vaata ↗')}</span>
        </a>

        <div className="stat-item">
          <div className="stat-num">{experienceCount}+</div>
          <div className="stat-label">aastat kogemust</div>
        </div>

        <div className="stat-item">
          <div className="stat-num">{toolsCount}</div>
          <div className="stat-label">tööriista</div>
        </div>
      </div>

      <CertificatesModal isOpen={certsOpen} onClose={() => setCertsOpen(false)} />
      <FeaturedWork />
    </main>
  )
}

export default Home