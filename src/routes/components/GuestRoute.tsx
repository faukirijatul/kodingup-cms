import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { FullPageLoader } from './FullPageLoader';

export function GuestRoute() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (user) {
    return <Navigate to="/students" replace />;
  }

  return <Outlet />;
}
