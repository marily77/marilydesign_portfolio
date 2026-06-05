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

  const githubHref = project.github
  const liveHref = project.live

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

        {project.images?.length > 0 && (
          <div className="pm-images">
            {project.images.map((img, i) => (
              <img key={i} src={img} alt={`${project.title} ${i + 1}`} className="pm-img" />
            ))}
          </div>
        )}

        {project['process_' + lang] && (
          <div className="pm-section">
            <span className="cm-label">// protsess</span>
            <p className="pm-process">{project['process_' + lang]}</p>
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
            <a href={githubHref} target="_blank" rel="noreferrer" className="btn">
              GitHub ↗
            </a>
          )}
          {project.live && (
            <a href={liveHref} target="_blank" rel="noreferrer" className="btn btn--accent">
              Live ↗
            </a>
          )}
        </div>

      </div>
    </div>
  )
}