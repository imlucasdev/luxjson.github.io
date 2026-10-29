import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { FileText, Eye, BookOpen } from 'lucide-react';
import useCursor from '../../hooks/useCursor';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const STAT_CONFIG = [
  { key: 'published', label: 'Posts Publicados', icon: BookOpen },
  { key: 'views',     label: 'Visualizações',   icon: Eye },
  { key: 'posts',     label: 'Total de Posts',   icon: FileText },
];

export default function DashboardHome() {
  const { api } = useAuth();
  useCursor();

  const [stats, setStats] = useState({ posts: 0, views: 0, published: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    Promise.all([
      api.get('/blog/stats', { signal: controller.signal }),
      api.get('/blog/posts?limit=5&publishedOnly=false', { signal: controller.signal }),
    ])
      .then(([statsRes, postsRes]) => {
        if (!active) return;
        setStats(statsRes.data);
        setRecentPosts(Array.isArray(postsRes.data?.posts) ? postsRes.data.posts : []);
      })
      .catch((error) => {
        if (active && error?.code !== 'ERR_CANCELED') {
          console.error('Erro ao carregar dados:', error);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [api]);

  if (loading) return <div className="sh-loading">Carregando...</div>;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="sh-dashboard-home"
    >
      <motion.div variants={itemVariants} className="sh-dashboard-stats">
        {STAT_CONFIG.map(({ key, label, icon: Icon }) => (
          <div key={key} className="sh-stat-card">
            <Icon size={24} strokeWidth={2} style={{ marginBottom: 8, opacity: 0.7 }} />
            <h3 className="fix">{stats[key]}</h3>
            <p>{label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="sh-recent-posts">
        <h2>Posts Recentes</h2>
        {recentPosts.length === 0 ? (
          <p style={{ marginTop: 16, opacity: 0.6 }}>Nenhum post encontrado.</p>
        ) : (
          <div className="sh-table-wrapper" style={{ marginTop: 20 }}>
            <table className="sh-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((post) => (
                  <motion.tr
                    key={post.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td>{post.title}</td>
                    <td>
                      <span
                        className={`sh-status-badge ${post.published ? 'published' : 'draft'}`}
                      >
                        {post.published ? 'Publicado' : 'Rascunho'}
                      </span>
                    </td>
                    <td className="fix">
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
