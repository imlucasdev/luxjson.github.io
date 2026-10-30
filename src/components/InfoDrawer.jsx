import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { GithubIcon } from './SocialIcons';

const iconBase = { strokeWidth: 2.5, 'aria-hidden': true };

/**
 * Drawer de informações sobre o site.
 * Antes duplicado em luxjson.jsx e Blog.jsx.
 *
 * Props:
 *  - isOpen / onClose
 *  - t
 *  - user (dados do GitHub)
 */
export default function InfoDrawer({ isOpen, onClose, t, user }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="sh-modal-overlay"
          />
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="sh-info-drawer-simple"
            role="dialog"
            aria-modal="true"
            aria-label={t('infoTitle')}
          >
            <div className="sh-info-drawer-header">
              <h2>{t('infoTitle')}</h2>
              <button onClick={onClose} className="sh-close-btn" aria-label={t('close')}>
                <X {...iconBase} size={22} />
              </button>
            </div>

            <div className="sh-info-drawer-body-simple">
              {user?.avatar_url && (
                <img
                  src={user.avatar_url}
                  alt={t('avatarAlt').replace('{name}', user.name || user.login)}
                  style={{ width: 80, borderRadius: '50%', marginBottom: 10 }}
                />
              )}
              <div className="sh-simple-version">
                <span className="sh-simple-badge">v1.1</span>
              </div>
              <div className="sh-simple-heart">
                {t('infoMade')} {user?.name || user?.login || 'luxjson'}
              </div>
            </div>

            <div className="sh-drawer-buttons">
              <a
                href="https://github.com/luxjson/luxjson.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className="sh-drawer-btn"
              >
                <GithubIcon size={18} /> {t('infoRepo')}
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
