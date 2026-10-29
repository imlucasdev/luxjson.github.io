import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="sh-loading">Carregando...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};