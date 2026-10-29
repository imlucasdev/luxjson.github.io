import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Atom,
  Inbox,
  Eye,
  Star,
  GitFork,
  Download,
  ArrowRight,
} from 'lucide-react';

// Componentes compartilhados
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import InfoDrawer from '../components/InfoDrawer';
import ProjectModal from '../components/ProjectModal';
import BootLoader from '../components/BootLoader';

// Hooks
import useCursor from '../hooks/useCursor';
import useThemeLang from '../hooks/useThemeLang';
import useBootLoader from '../hooks/useBootLoader';

// Utils
import { createT } from '../utils/translations';
import renderMixedText from '../utils/renderMixedText';
import { getLanguageColor } from '../utils/languageColors';

const iconBase = { strokeWidth: 2.5, 'aria-hidden': true };

const GITHUB_TARGETS = ['luxjson.github.io', 'analisai-express', 'react', 'light', 'insomnia', 'senai-marycario', 'luxjson-app', 'api', 'timesesi'];
const GITHUB_BLACKLIST = ['lightoldwebsite'];

function renderHighlightedTranslation(value) {
  const parts = String(value || '').split(/<span class="sh-h-word">([\s\S]*?)<\/span>/g);
  return parts.map((part, index) =>
    index % 2 === 1 ? <span key={index} className="sh-h-word">{part}</span> : part,
  );
}

export default function Luxjson() {
  const { theme, language, toggleTheme, toggleLanguage } = useThemeLang();
  const t = createT(language);
  useCursor();

  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const { isLoading, progress } = useBootLoader(!dataLoading);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const fetchData = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch('https://api.github.com/users/luxjson', { signal: controller.signal }),
          fetch('https://api.github.com/users/luxjson/repos?per_page=100&sort=pushed', { signal: controller.signal }),
        ]);

        if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');

        const [userData, reposData] = await Promise.all([userRes.json(), reposRes.json()]);
        if (!active) return;

        setUser(userData);
        setProjects(reposData.filter((repo) =>
          GITHUB_TARGETS.some((target) => repo.name.toLowerCase().includes(target)) &&
          !GITHUB_BLACKLIST.some((name) => repo.name.toLowerCase() === name)
        ));
      } catch (error) {
        if (active && error?.name !== 'AbortError') {
          console.error('Erro ao buscar dados do GitHub:', error);
        }
      } finally {
        if (active) setDataLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="sohub-root selection:bg-black selection:text-white">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        language={language}
        toggleLanguage={toggleLanguage}
        t={t}
        onChatOpen={() => setIsChatOpen(true)}
        homeLink="scroll"
      />

      <main id="main-content">
        {/* HERO */}
        <section id="home" className="sh-hero">
          <div className="sh-hero-container">
            <div className="sh-hero-text">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="sh-giant-title"
              >
                {renderMixedText('luxjson')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="sh-hero-sub fix"
              >
                {t('heroTitle')}
              </motion.p>
            </div>
            <div className="sh-hero-render">
              <Atom
                {...iconBase}
                className="sh-float-icon"
                size="15vw"
                style={{ width: '15vw', height: '15vw' }}
              />
            </div>
          </div>
        </section>

        {/* PROJETOS */}
        <section id="work" className="sh-work">
          <div className="sh-container">
            <span className="sh-section-tag fix">{t('workTag')}</span>
            <h2 className="sh-description-text">
              {renderHighlightedTranslation(t('workDesc'))}
            </h2>

            <div className="sh-projects-grid">
              {dataLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="sh-project-skeleton">
                    <div className="sh-skeleton-image" />
                    <div className="sh-skeleton-content">
                      <div className="sh-skeleton-title" />
                      <div className="sh-skeleton-desc" />
                      <div className="sh-skeleton-tags" />
                    </div>
                  </div>
                ))
              ) : projects.length === 0 ? (
                <div className="sh-empty-state">
                  <Inbox {...iconBase} size={28} />
                  <p>{t('noProjects')}</p>
                </div>
              ) : (
                projects.map((repo, i) => (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="sh-project-card"
                    onClick={() => setSelectedProject(repo)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedProject(repo)}
                    aria-label={`Ver detalhes: ${repo.name}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="sh-project-card-inner">
                      <div
                        className="sh-project-card-image"
                        style={{
                          backgroundImage: `url(https://opengraph.githubassets.com/1/luxjson/${repo.name})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <div className="sh-project-card-overlay">
                          <div className="sh-project-card-hint">
                            <Eye {...iconBase} size={18} />
                            <span>{t('clickToSeeDetails')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="sh-project-card-content">
                        <div className="sh-project-card-header">
                          <h3 className="sh-project-card-title">
                            {renderMixedText(repo.name.replace(/-/g, ' '))}
                          </h3>
                          {repo.language && (
                            <span
                              className="sh-project-card-lang"
                              style={{ backgroundColor: getLanguageColor(repo.language) }}
                            >
                              {repo.language}
                            </span>
                          )}
                        </div>
                        {repo.description && (
                          <p className="sh-project-card-desc">
                            {repo.description.length > 60
                              ? repo.description.slice(0, 60) + '...'
                              : repo.description}
                          </p>
                        )}
                        <div className="sh-project-card-meta">
                          {repo.stargazers_count > 0 && (
                            <span>
                              <Star {...iconBase} size={16} /> {repo.stargazers_count}
                            </span>
                          )}
                          {repo.forks_count > 0 && (
                            <span>
                              <GitFork {...iconBase} size={16} /> {repo.forks_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* SOBRE */}
        <section id="about" className="sh-services fundo-escuro">
          <div className="sh-container">
            <div className="sh-service-card">
              <h2 className="sh-service-title">
                {t('aboutTitle').split(' ')[0]}
                <br />
                <span className="text-grey span">
                  {t('aboutTitle').split(' ').slice(1).join(' ')}
                </span>
              </h2>
              <p className="sh-service-desc">{t('aboutDesc')}</p>
              {user && (
                <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <img src={user.avatar_url} alt="Avatar" style={{ width: '60px', borderRadius: '50%' }} />
                  <div>
                    <p style={{ fontSize: '18px' }}>{user.name || user.login}</p>
                    <p style={{ color: 'var(--sohub-grey)', fontSize: '14px' }}>{user.bio}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* APP BANNER */}
        <section className="sh-app-banner">
          <div className="sh-container">
            <img
              src="https://luxjson.is-a.dev/favicon.png"
              crossOrigin="anonymous"
              className="sh-banner-logo"
              alt="Logo luxjson"
            />
            <div className="sh-banner-content">
              <h2 className="sh-banner-title">{t('appBannerTitle')}</h2>
              <p className="sh-banner-desc">{t('appBannerDesc')}</p>
              <a
                href="https://github.com/luxjson/luxjson-app/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="sh-modal-btn-primary sh-banner-btn"
              >
                <Download {...iconBase} size={18} /> {t('appBannerBtn')}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer t={t} user={user} onInfoOpen={() => setIsInfoOpen(true)} />

      <ContactModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        t={t}
        language={language}
      />
      <InfoDrawer
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        t={t}
        user={user}
      />
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        t={t}
        language={language}
      />

      <BootLoader isLoading={isLoading} progress={progress} />

      <motion.a
        href="https://api.luxjson.is-a.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="sh-api-float-btn"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Ver API"
      >
        <span className="sh-api-text">API</span>
        <div className="sh-circle-icon sh-api-icon-wrap">
          <ArrowRight {...iconBase} size={18} />
        </div>
      </motion.a>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
