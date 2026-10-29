import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, RefreshCw } from 'lucide-react';
import emailjs from '@emailjs/browser';

const iconBase = { strokeWidth: 2.5, 'aria-hidden': true };

// ⚠️ Mova estas credenciais para variáveis de ambiente (.env):
// VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
const EMAILJS_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_2agyezv';
const EMAILJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_keoux04';
const EMAILJS_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '-7mi-fOFqFgasG8qS';

/**
 * Modal de contato compartilhado por luxjson, Blog e BlogPost.
 * Antes havia 3 cópias idênticas com ícones diferentes.
 *
 * Props:
 *  - isOpen / onClose
 *  - t / language
 */
export default function ContactModal({ isOpen, onClose, t }) {
  const form = useRef();
  const [status, setStatus] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus(t('chatSending'));

    emailjs
      .sendForm(EMAILJS_SERVICE, EMAILJS_TEMPLATE, form.current, EMAILJS_KEY)
      .then(() => {
        setStatus(t('chatSent'));
        setTimeout(() => {
          onClose();
          setStatus('');
          form.current?.reset();
        }, 2000);
      })
      .catch(() => {
        setStatus(t('chatError'));
        setTimeout(() => setStatus(''), 3000);
      });
  };

  const isSending = status === t('chatSending');

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
            key="modal"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="sh-chat-modal"
            role="dialog"
            aria-modal="true"
            aria-label={t('chatTitle')}
          >
            <div className="sh-modal-header">
              <h2>{t('chatTitle')}</h2>
              <button onClick={onClose} className="sh-close-btn" aria-label="Fechar">
                <X {...iconBase} size={22} />
              </button>
            </div>

            <form ref={form} onSubmit={sendEmail} className="sh-modal-form">
              <div className="sh-input-group">
                <label className="fix" htmlFor="cm-name">{t('chatName')}</label>
                <input
                  type="text"
                  id="cm-name"
                  name="user_name"
                  placeholder={t('chatPlaceholderName')}
                  required
                  autoComplete="name"
                />
              </div>
              <div className="sh-input-group">
                <label className="fix" htmlFor="cm-email">{t('chatEmail')}</label>
                <input
                  type="email"
                  id="cm-email"
                  name="user_email"
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="sh-input-group">
                <label className="fix" htmlFor="cm-subject">{t('chatSubject')}</label>
                <input
                  type="text"
                  id="cm-subject"
                  name="subject"
                  placeholder={t('chatPlaceholderSubject')}
                  required
                />
              </div>
              <div className="sh-input-group">
                <label className="fix" htmlFor="cm-message">{t('chatMessage')}</label>
                <textarea
                  id="cm-message"
                  name="message"
                  placeholder={t('chatPlaceholderMsg')}
                  rows="5"
                  required
                />
              </div>

              <div className="sh-modal-footer">
                <button type="submit" className="sh-submit-pill" disabled={isSending}>
                  <span>{status || t('chatSend')}</span>
                  <div className="sh-circle-icon">
                    {isSending ? (
                      <RefreshCw
                        {...iconBase}
                        size={18}
                        style={{ animation: 'spin 1s linear infinite' }}
                      />
                    ) : (
                      <ArrowRight {...iconBase} size={18} />
                    )}
                  </div>
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
