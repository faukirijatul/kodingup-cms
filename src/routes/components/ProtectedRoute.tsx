import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { FullPageLoader } from './FullPageLoader';

export function ProtectedRoute() {
  const { data: user, isLoading } = useCurrentUser();
  const location = useLocation();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
