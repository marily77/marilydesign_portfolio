import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './ProjectModal.css'

export default function ProjectModal({ project, onClose }) {
  const { i18n } = useTranslation()
  const lang = i18n.language.startsWith('et') ? 'et' : 'en'

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // Process: split '\n' lines into steps array (works for both string and array)
  const processRaw = project['process_' + lang]
  const processSteps = Array.isArray(processRaw)
    ? processRaw
    : processRaw
      ? processRaw.split('\n').filter(Boolean)
      : []

  const components = project['components_' + lang]

  return (
    <div className="pm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pm-panel">

        <button className="pm-close" onClick={onClose} aria-label="Sulge">
          <span /><span />
        </button>

        <div className="pm-header">
          <span className="pm-category tag">{project.category}</span>
          <h2 className="pm-title">{project.title}</h2>
          <p className="pm-desc">{project['description_' + lang]}</p>
        </div>

        {/* Stats row — only if project has stats (e.g. portfolio) */}
        {project.stats && (
          <div className="pm-stats">
            <div className="pm-stat">
              <span className="pm-stat__num">{project.stats.components}</span>
              <span className="pm-stat__label">{lang === 'et' ? 'komponenti' : 'components'}</span>
            </div>
            <div className="pm-stat">
              <span className="pm-stat__num">{project.stats.certificates}+</span>
              <span className="pm-stat__label">{lang === 'et' ? 'sertifikaati' : 'certificates'}</span>
            </div>
            <div className="pm-stat">
              <span className="pm-stat__num">{project.stats.certCategories}</span>
              <span className="pm-stat__label">{lang === 'et' ? 'kategooriat' : 'categories'}</span>
            </div>
            <div className="pm-stat">
              <span className="pm-stat__num">{project.stats.languages}</span>
              <span className="pm-stat__label">{lang === 'et' ? 'keelt' : 'languages'}</span>
            </div>
          </div>
        )}

        {project.images?.length > 0 && (
          <div className="pm-images">
            {project.images.map((img, i) => (
              <img key={i} src={img} alt={`${project.title} ${i + 1}`} className="pm-img" />
            ))}
          </div>
        )}

        {/* Components list — only if present */}
        {components?.length > 0 && (
          <div className="pm-section">
            <span className="cm-label">// komponendid</span>
            <ul className="pm-components">
              {components.map((c, i) => (
                <li key={i} className="pm-component-item">
                  <span className="pm-component-name">{c.split(' — ')[0]}</span>
                  {c.includes(' — ') && (
                    <span className="pm-component-desc"> — {c.split(' — ')[1]}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Process steps */}
        {processSteps.length > 0 && (
          <div className="pm-section">
            <span className="cm-label">// protsess</span>
            <ol className="pm-process-steps">
              {processSteps.map((step, i) => {
                // Strip leading "1. " numbering if present (we use <ol>)
                const text = step.replace(/^\d+\.\s*/, '')
                const [title, ...rest] = text.split(' — ')
                return (
                  <li key={i} className="pm-step">
                    <span className="pm-step__title">{title}</span>
                    {rest.length > 0 && (
                      <span className="pm-step__desc"> — {rest.join(' — ')}</span>
                    )}
                  </li>
                )
              })}
            </ol>
          </div>
        )}

        <div className="pm-section">
          <span className="cm-label">// tech stack</span>
          <div className="pm-tech">
            {project.tech.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        </div>

        <div className="pm-links">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className="btn">
              GitHub ↗
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer" className="btn btn--accent">
              Live ↗
            </a>
          )}
        </div>

      </div>
    </div>
  )
}