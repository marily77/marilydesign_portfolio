import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ParticleCloud from '../components/ParticleCloud'
import './Home.css'
import { useState } from 'react'
import CertificatesModal from '../components/CertificatesModal'
import FeaturedWork from '../components/FeaturedWork' 

function Home() {
  const { t } = useTranslation()
  const [certsOpen, setCertsOpen] = useState(false)

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

      <div className="stats-row">
        <a
          href="https://github.com/marily77"
          target="_blank"
          rel="noreferrer"
          className="stat-item stat-clickable"
        >
          <div className="stat-num">10+</div>
          <div className="stat-label">projekti GitHubis</div>
          <span className="stat-hint">{t('home.viewHint', 'vaata ↗')}</span>
        </a>
        <div className="stat-item">
          <div className="stat-num">2</div>
          <div className="stat-label">keelt · ET / EN</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">∞</div>
          <div className="stat-label">uudishimu</div>
        </div>
        <button
          className="stat-item stat-clickable"
          onClick={() => setCertsOpen(true)}
          aria-label="Vaata sertifikaate"
        >
          <div className="stat-num">15+</div>
          <div className="stat-label">{t('home.certificates', 'sertifikaati')}</div>
          <span className="stat-hint">{t('home.viewHint', 'vaata ↗')}</span>
        </button>
      </div>

      <CertificatesModal isOpen={certsOpen} onClose={() => setCertsOpen(false)} />
      <FeaturedWork />
    </main>
  )
}

export default Home