import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { safeImageUrl } from '../utils/safeImageUrl';
import { Eye, Inbox, Clock } from 'lucide-react';
import { FileText } from 'lucide-react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import InfoDrawer from '../components/InfoDrawer';
import BootLoader from '../components/BootLoader';

import useCursor from '../hooks/useCursor';
import useThemeLang from '../hooks/useThemeLang';
import useBootLoader from '../hooks/useBootLoader';

import { createT } from '../utils/translations';

import '../assets/styles/blog.css';
import '../assets/styles/luxjson.css';

const iconBase = { strokeWidth: 2.5, 'aria-hidden': true };

export default function Blog() {
  const { theme, language, toggleTheme, toggleLanguage } = useThemeLang();
  const t = createT(language);
  useCursor();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [postsError, setPostsError] = useState(false);
  const [user, setUser] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const { isLoading } = useBootLoader(!dataLoading);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const fetchAll = async () => {
      const [userResult, postsResult] = await Promise.allSettled([
        fetch('https://api.github.com/users/luxjson', { signal: controller.signal }).then((response) => {
          if (!response.ok) throw new Error('GitHub profile request failed.');
          return response.json();
        }),
        api.get('/blog/posts?limit=10&publishedOnly=true', { signal: controller.signal }),
      ]);

      if (!active) return;

      if (userResult.status === 'fulfilled') setUser(userResult.value);

      if (postsResult.status === 'fulfilled' && Array.isArray(postsResult.value.data?.posts)) {
        setPosts(postsResult.value.data.posts);
        setPostsError(false);
      } else {
        setPosts([]);
        setPostsError(true);
      }

      setDataLoading(false);
    };

    fetchAll().catch((error) => {
      if (active && error?.code !== 'ERR_CANCELED') {
        setPostsError(true);
        setDataLoading(false);
      }
    });

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
        homeLink="link"
        showWorkLink={false}
      />

      <main id="main-content">
        {/* HERO */}
        <section className="sh-hero" style={{ minHeight: '60vh' }}>
          <div className="sh-hero-container">
            <div className="sh-hero-text">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="sh-giant-title-1"
                style={{ fontSize: 'clamp(80px, 15vw, 250px)' }}
              >
                {t('blogHeroTitle')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="sh-hero-sub fix"
              >
                {t('blogHeroSub')}
              </motion.p>
            </div>
            <div className="sh-hero-render">
              <FileText
                {...iconBase}
                className="sh-float-icon"
                size="15vw"
                style={{ width: '15vw', height: '15vw' }}
              />
            </div>
          </div>
        </section>

        {/* POSTS */}
        <section className="sh-work">
          <div className="sh-container">
            <span className="sh-section-tag fix">{t('blogHeroSub')}</span>

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
              ) : postsError ? (
                <div className="sh-empty-state" role="status">
                  <Inbox {...iconBase} size={28} />
                  <p>{t('errorLoadingPosts')}</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="sh-empty-state">
                  <Inbox {...iconBase} size={28} />
                  <p>{t('noPosts')}</p>
                </div>
              ) : (
                posts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="sh-project-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    role="article"
                  >
                    <div className="sh-project-card-inner">
                      <div
                        className="sh-project-card-image"
                        style={{
                          backgroundImage: safeImageUrl(post.cover_image) ? `url("${safeImageUrl(post.cover_image)}")` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: 'var(--sohub-surface)',
                        }}
                      >
                        <div className="sh-project-card-overlay">
                          <div className="sh-project-card-hint">
                            <Eye {...iconBase} size={18} />
                            <span>{t('clickToRead')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="sh-project-card-content">
                        <div className="sh-project-card-header">
                          <h3 className="sh-project-card-title">{post.title}</h3>
                          <span
                            className="sh-project-card-lang"
                            style={{ backgroundColor: 'var(--sohub-success)', color: '#fff' }}
                          >
                            {new Date(post.published_at || post.created_at).toLocaleDateString(
                              language === 'pt' ? 'pt-BR' : 'en-US',
                              { day: '2-digit', month: 'short', year: 'numeric' }
                            )}
                          </span>
                        </div>
                        {post.excerpt && (
                          <p className="sh-project-card-desc">
                            {post.excerpt.length > 80
                              ? post.excerpt.slice(0, 80) + '...'
                              : post.excerpt}
                          </p>
                        )}
                        <div className="sh-project-card-meta">
                          {post.views > 0 && (
                            <span>
                              <Eye {...iconBase} size={16} /> {post.views}
                            </span>
                          )}
                          <span>
                            <Clock {...iconBase} size={16} />{' '}
                            {new Date(post.created_at).toLocaleDateString(
                              language === 'pt' ? 'pt-BR' : 'en-US'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
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
      <BootLoader isLoading={isLoading} />
    </div>
  );
}
