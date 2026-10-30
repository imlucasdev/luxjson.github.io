import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  X,
  Star,
  GitFork,
  Bug,
  History,
  ExternalLink,
  Link as LinkIcon,
  Info,
} from 'lucide-react';
import { getLanguageColor } from '../utils/languageColors';
import renderMixedText from '../utils/renderMixedText';
import { safeExternalUrl } from '../utils/safeExternalUrl';

const iconBase = { strokeWidth: 2.5, 'aria-hidden': true };

/**
 * Modal de detalhes de projeto GitHub.
 * Extraído de luxjson.jsx para separação de responsabilidade.
 *
 * Props:
 *  - project (repo object) | null
 *  - onClose
 *  - t
 *  - language
 */
export default function ProjectModal({ project, onClose, t, language }) {
  const repositoryUrl = safeExternalUrl(project?.html_url);
  const homepageUrl = safeExternalUrl(project?.homepage);
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US');

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="project-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="sh-project-modal-overlay"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="sh-project-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={project.name}
          >
            <button
              onClick={onClose}
              className="sh-project-modal-close"
              aria-label={t('modalClose')}
            >
              <X {...iconBase} size={22} />
            </button>

            <div className="sh-project-modal-body">
              <div className="sh-project-modal-image">
                <img
                  src={`https://opengraph.githubassets.com/1/luxjson/${project.name}`}
                  alt={project.name}
                  onError={(e) => {
                    const fallbackSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="#1e232c"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#8896a8" text-anchor="middle" dy=".3em">' + t('noPreview') + '</text></svg>';
                    e.target.src = 'data:image/svg+xml,' + encodeURIComponent(fallbackSvg);
                    e.target.style.objectFit = 'contain';
                  }}
                />
              </div>

              <div className="sh-project-modal-details">
                <div className="sh-project-modal-header-info">
                  <h2>{renderMixedText(project.name.replace(/-/g, ' '))}</h2>
                  {project.language && (
                    <span
                      className="sh-project-language-badge"
                      style={{ backgroundColor: getLanguageColor(project.language) }}
                    >
                      {project.language}
                    </span>
                  )}
                </div>

                {project.description ? (
                  <p>{project.description}</p>
                ) : (
                  <p className="sh-modal-fallback">
                    <Info {...iconBase} size={18} /> {t('modalNoDesc')}
                  </p>
                )}

                <div className="sh-project-modal-stats">
                  {project.stargazers_count > 0 && (
                    <span>
                      <Star {...iconBase} size={16} /> {project.stargazers_count}{' '}
                      <small>{t('modalStars')}</small>
                    </span>
                  )}
                  {project.forks_count > 0 && (
                    <span>
                      <GitFork {...iconBase} size={16} /> {project.forks_count}{' '}
                      <small>{t('modalForks')}</small>
                    </span>
                  )}
                  {project.open_issues_count > 0 && (
                    <span>
                      <Bug {...iconBase} size={16} /> {project.open_issues_count}{' '}
                      <small>{t('modalIssues')}</small>
                    </span>
                  )}
                  <span>
                    <History {...iconBase} size={16} /> {formatDate(project.updated_at)}{' '}
                    <small>{t('modalUpdated')}</small>
                  </span>
                </div>

                <div className="sh-project-modal-footer">
                  {project.name.toLowerCase() === 'insomnia' ? (
                    <Link to="/insomnia" className="sh-modal-btn-primary">
                      <ExternalLink {...iconBase} size={18} /> {t('modalAccess')}
                    </Link>
                  ) : repositoryUrl ? (
                    <a
                      href={repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sh-modal-btn-primary"
                    >
                      <ExternalLink {...iconBase} size={18} /> {t('modalViewGit')}
                    </a>
                  ) : null}
                  {homepageUrl && (
                    <a
                      href={homepageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sh-modal-btn-secondary"
                    >
                      <LinkIcon {...iconBase} size={18} /> {t('modalDemo')}
                    </a>
                  )}
                </div>

                {project.topics?.length > 0 && (
                  <div className="sh-project-modal-topics">
                    <span className="sh-modal-topics-label">{t('modalTopics')}:</span>
                    {project.topics.map((topic) => (
                      <span key={topic} className="sh-modal-topic">
                        #{topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
