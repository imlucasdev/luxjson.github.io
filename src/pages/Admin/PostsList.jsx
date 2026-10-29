import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, FilePlus, FileText } from 'lucide-react';
import useCursor from '../../hooks/useCursor';

const iconBase = { strokeWidth: 2.5, size: 16, 'aria-hidden': true };

export default function PostsList() {
  const { api } = useAuth();
  const navigate = useNavigate();
  useCursor();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    api.get('/blog/posts?publishedOnly=false&limit=100', { signal: controller.signal })
      .then((response) => {
        if (active) setPosts(Array.isArray(response.data?.posts) ? response.data.posts : []);
      })
      .catch((error) => {
        if (!active || error?.code === 'ERR_CANCELED') return;
        console.error('Erro ao buscar posts:', error);
        alert(error.response?.data?.message || 'Não foi possível carregar os posts.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [api]);

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este post?')) return;
    setDeleting(id);
    try {
      await api.delete(`/blog/posts/${id}`);
      setPosts((curr) => curr.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      alert(error.response?.data?.message || 'Não foi possível excluir o post.');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className="sh-loading">Carregando posts...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sh-list-container"
    >
      <div className="sh-list-header">
        <h2>Todos os Posts</h2>
        <Link to="/admin/posts/new" className="sh-btn-primary">
          <FilePlus size={16} strokeWidth={2.5} /> Adicionar Novo Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="sh-empty-state">
          <FileText size={28} strokeWidth={2} />
          <p>Nenhum post criado ainda.</p>
          <Link to="/admin/posts/new" className="sh-btn-primary">
            Criar Primeiro Post
          </Link>
        </div>
      ) : (
        <div className="sh-table-wrapper">
          <table className="sh-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <motion.tr
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td>{post.title}</td>
                  <td>
                    <span className={`sh-status-badge ${post.published ? 'published' : 'draft'}`}>
                      {post.published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="fix">
                    {new Date(post.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td>
                    <div className="sh-actions">
                      <button
                        onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                        className="sh-btn-sm"
                        aria-label={`Editar: ${post.title}`}
                      >
                        <Pencil {...iconBase} /> Editar
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="sh-btn-sm sh-btn-danger"
                        disabled={deleting === post.id}
                        aria-label={`Excluir: ${post.title}`}
                      >
                        <Trash2 {...iconBase} />
                        {deleting === post.id ? 'Excluindo...' : 'Excluir'}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
