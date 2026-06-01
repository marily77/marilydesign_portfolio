import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProjectCard from '../components/ProjectCard'
import projects from '../data/projects.json'
import './Projects.css'

const CATEGORIES = ['kõik', 'web', 'dataviz', 'python']

function Projects() {
  const { t } = useTranslation()
  const [active, setActive] = useState('kõik')

  const filtered = active === 'kõik'
    ? projects
    : projects.filter(function(p) { return p.category === active })

  const filterButtons = CATEGORIES.map(function(cat) {
    const cls = 'projects-page__filter' + (active === cat ? ' is-active' : '')
    return (
      <button key={cat} className={cls} onClick={function() { setActive(cat) }}>
        {cat}
      </button>
    )
  })

  const projectCards = filtered.map(function(project) {
    return <ProjectCard key={project.id} project={project} />
  })

  const githubHref = 'https://github.com/marily77'

  return (
    <main className="projects-page">
      <p className="section-label">// {t('projects.label', 'projektid')}</p>
      <h1>{t('projects.title', 'Minu tööd')}</h1>
      <p className="projects-page__sub">
        {t('projects.subtitle', 'Kood, andmed ja disain.')}
      </p>

      <div className="projects-page__filters">
        {filterButtons}
      </div>

      <div className="projects-page__grid">
        {projectCards}
      </div>

      <div className="projects-page__github">
        <p className="projects-page__github-text">
          {t('projects.githubNote', 'Rohkem töid GitHubis')}
        </p>
        <a href={githubHref} target="_blank" rel="noreferrer" className="btn">
          GitHub ↗
        </a>
      </div>
    </main>
  )
}

export default Projects