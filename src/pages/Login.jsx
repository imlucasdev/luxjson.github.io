import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import useCursor from '../hooks/useCursor';
import useThemeLang from '../hooks/useThemeLang';
import '../assets/styles/admin.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  useCursor();
  useThemeLang(); // aplica tema salvo globalmente

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="sh-login-page">
      <div className="sh-login-wrapper">
        <div className="sh-login-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="sh-login-card"
          >
            <div className="sh-login-header">
              <h1 style={{ fontSize: '4rem' }}>luxjson</h1>
            </div>

            <form onSubmit={handleSubmit} className="sh-login-form">
              <div className="sh-input-group">
                <label className="fix" htmlFor="login-user">USERNAME</label>
                <input
                  type="text"
                  id="login-user"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  autoComplete="username"
                />
              </div>
              <div className="sh-input-group">
                <label className="fix" htmlFor="login-pass">PASSWORD</label>
                <input
                  type="password"
                  id="login-pass"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="sh-login-error" role="alert">{error}</div>
              )}

              <button type="submit" className="sh-login-btn" disabled={loading}>
                {loading ? 'ACESSANDO...' : 'LOGIN'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="sh-btn-secondary"
                style={{ width: '100%', marginTop: 12, textAlign: 'center', justifyContent: 'center' }}
              >
                BACK TO HOME
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
