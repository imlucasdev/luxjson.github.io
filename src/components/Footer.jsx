import { Info } from 'lucide-react';
import { GithubIcon, InstagramIcon } from './SocialIcons';
import renderMixedText from '../utils/renderMixedText';

const iconBase = { strokeWidth: 2.5, 'aria-hidden': true };

/**
 * Footer compartilhado por luxjson, Blog e BlogPost.
 * Antes duplicado em 3 arquivos com ícones inconsistentes.
 *
 * Props:
 *  - t (função de tradução)
 *  - user (dados do GitHub)
 *  - onInfoOpen (callback para abrir drawer de info)
 */
export default function Footer({ t, user, onInfoOpen }) {
  return (
    <footer className="sh-footer">
      <div className="sh-footer-bg-text">{renderMixedText('luxjson')}</div>
      <div className="sh-footer-main fundo-escuro">
        <h2 className="sh-footer-title">© luxjson</h2>
        <span className="sh-footer-sub fix">{t('footerSub')}</span>

        <div className="sh-footer-socials">
          <a
            href="https://github.com/luxjson"
            target="_blank"
            rel="noopener noreferrer"
            className="sh-social-link"
            aria-label="GitHub"
          >
            <GithubIcon size={22} />
          </a>
          <a
            href="https://instagram.com/luxjson"
            target="_blank"
            rel="noopener noreferrer"
            className="sh-social-link"
            aria-label="Instagram"
          >
            <InstagramIcon size={22} />
          </a>
          <button
            onClick={onInfoOpen}
            className="sh-social-link"
            aria-label="Abrir informações"
          >
            <Info {...iconBase} size={20} />
          </button>
        </div>

        {user && (
          <div style={{ fontFamily: 'monospace', marginTop: '20px', color: 'var(--sohub-grey)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
              <GithubIcon size={22} /> · {user.public_repos} repositorys · {user.followers} followers
          </div>
        )}
      </div>
    </footer>
  );
}
