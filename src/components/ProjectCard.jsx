import { useTranslation } from 'react-i18next'
import './ProjectCard.css'

function ProjectCard({ project, featured = false, onClick }) {
  const { i18n } = useTranslation()
  const lang = i18n.language.startsWith('et') ? 'et' : 'en'
  const description = project['description_' + lang]

  const githubLink = project.github ? (
    <a href={project.github} target="_blank" rel="noreferrer" className="project-card__link">
      GitHub ↗
    </a>
  ) : null

  const liveLink = project.live ? (
    <a href={project.live} target="_blank" rel="noreferrer" className="project-card__link project-card__link--live">
      Live ↗
    </a>
  ) : null

  const techTags = project.tech.map(function(tech) {
    return <span key={tech} className="tag">{tech}</span>
  })

  const cardClass = 'project-card' + (featured ? ' project-card--featured' : '')

  return (
    <article className={cardClass} onClick={onClick} style={{ cursor: 'pointer' }}>
    
     <div className="project-card__header">
        <span className="tag">{project.category}</span>
        <div className="project-card__links">
          {githubLink}
          {liveLink}
        </div>
      </div>
      <h3 className="project-card__title">{project.title}</h3>
      <p className="project-card__desc">{description}</p>
      <div className="project-card__tech">
        {techTags}
      </div>
    </article>
  )
}

export default ProjectCard