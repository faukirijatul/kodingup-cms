import type { User } from 'firebase/auth';
import { useQuery } from '@tanstack/react-query';
import { HttpService } from '@/services/http';
import { authHttpKeys } from '@/configs/httpKeys';

export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: authHttpKeys.currentUser,
    queryFn: HttpService.getCurrentUser,
  });
}
