import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import './CertificatesModal.css'

const CATEGORIES = ['all', 'design', 'dev','uiux','ai']

export default function CertificatesModal({ isOpen, onClose }) {
  const { t } = useTranslation()
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedCert, setSelectedCert] = useState(null)
  const [certificates, setCertificates] = useState([])

  useEffect(() => {
    import('../data/certificates.json').then(m => setCertificates(m.default))
  }, [])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      if (selectedCert) setSelectedCert(null)
      else onClose()
    }
  }, [selectedCert, onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  const filtered = activeFilter === 'all'
    ? certificates
    : certificates.filter(c => c.category === activeFilter)

  const categoryLabel = {
    all: t('certificates.filterAll', 'Kõik'),
   
    design: t('certificates.filterDesign', 'Disain'),
    dev: t('certificates.filterDev', 'Arendus'),
    uiux: t('certificates.filterUiux', 'UI/UX'),
    ai: t('certificates.filterAi', 'AI/ML'),
  }

  return (
    <div className="cm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cm-panel" role="dialog" aria-modal="true">

        {/* Header */}
        <div className="cm-header">
          <div className="cm-title-block">
            <span className="cm-label">{t('certificates.label', 'SERTIFIKAADID')}</span>
            <h2 className="cm-title">
              {certificates.length}<span className="cm-accent">+</span>
            </h2>
          </div>
          <button className="cm-close" onClick={onClose} aria-label="Sulge">
            <span />
            <span />
          </button>
        </div>

        {/* Filters */}
        <div className="cm-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cm-filter-btn ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {categoryLabel[cat]}
              {cat === 'all'
                ? <span className="cm-count">{certificates.length}</span>
                : <span className="cm-count">{certificates.filter(c => c.category === cat).length}</span>
              }
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="cm-grid">
          {filtered.map((cert, i) => (
            <button
              key={cert.id}
              className="cm-card"
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => setSelectedCert(cert)}
            >
              <div className="cm-card-img">
                {cert.image ? (
                  <img src={cert.image} alt={cert.title} loading="lazy" />
                ) : (
                  <div className="cm-card-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                )}
                <div className="cm-card-overlay">
                  <span>{t('certificates.view', 'Vaata')}</span>
                </div>
              </div>
              <div className="cm-card-info">
                <p className="cm-card-issuer">{cert.issuer}</p>
                <h3 className="cm-card-title">{cert.title}</h3>
                <span className="cm-card-year">{cert.year}</span>
              </div>
            </button>
          ))}
        </div>

      </div>

      {/* Lightbox */}
      {selectedCert && (
        <div className="cm-lightbox" onClick={() => setSelectedCert(null)}>
          <div className="cm-lightbox-inner" onClick={e => e.stopPropagation()}>
            <button className="cm-close cm-lightbox-close" onClick={() => setSelectedCert(null)} aria-label="Sulge">
              <span /><span />
            </button>
            <div className="cm-lightbox-img">
              {selectedCert.image ? (
                <img src={selectedCert.image} alt={selectedCert.title} />
              ) : (
                <div className="cm-card-placeholder cm-lightbox-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="cm-lightbox-info">
              <span className="cm-label">{selectedCert.issuer} · {selectedCert.year}</span>
              <h3>{selectedCert.title}</h3>
              {selectedCert.verifyUrl && (
                <a href={selectedCert.verifyUrl} target="_blank" rel="noreferrer" className="cm-verify-btn">
                  {t('certificates.verify', 'Kontrolli')} ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}