import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import ProjectCard from './ProjectCard'
import projects from '../data/projects.json'
import './FeaturedWork.css'

function FeaturedWork() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const featured = projects.filter(p => p.featured).slice(0, 3)

  return (
    <section className="featured-work">
      <div className="featured-work__header">
        <p className="section-label">// {t('featured.label', 'valitud tööd')}</p>
        <Link to="/projects" className="featured-work__all">
          {t('featured.all', 'kõik projektid')} →
        </Link>
      </div>

      <div className="featured-work__grid">
        {featured.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            featured
            onClick={() => navigate('/projects', { state: { openProject: project.id } })}
          />
        ))}
      </div>
    </section>
  )
}

export default FeaturedWork