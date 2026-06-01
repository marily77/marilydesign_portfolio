import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ProjectCard from './ProjectCard'
import projects from '../data/projects.json'
import './FeaturedWork.css'

function FeaturedWork() {
  const { t } = useTranslation()
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
          <ProjectCard key={project.id} project={project} featured />
        ))}
      </div>
    </section>
  )
}

export default FeaturedWork