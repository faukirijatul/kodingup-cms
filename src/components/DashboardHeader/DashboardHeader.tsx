import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ChevronRight, LogOut } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Avatar from '@radix-ui/react-avatar';
import { HttpService } from '@/services/http';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { authHttpKeys } from '@/configs/httpKeys';
import { getInitials } from '@/lib/getInitials';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type DashboardHeaderProps = {
  breadcrumbs: BreadcrumbItem[];
};

export function DashboardHeader({ breadcrumbs }: DashboardHeaderProps) {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useCurrentUser();

  const displayName = useMemo(
    () => user?.displayName || user?.email || 'User',
    [user],
  );
  const avatarUrl = useMemo(() => user?.photoURL || '', [user]);
  const initials = useMemo(() => getInitials(displayName), [displayName]);

  const handleLogout = useCallback(async () => {
    try {
      await HttpService.logout();
      queryClient.setQueryData(authHttpKeys.currentUser, null);
      queryClient.clear();
    } catch (error) {
      console.error(error);
      toast.error('Logout failed');
    }
  }, [queryClient]);

  return (
    <header className="bg-bg-primary flex h-17.5 w-full items-center justify-between px-6">
      <nav className="flex h-5 items-center gap-1.5">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <div key={item.label} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="text-muted h-3.5 w-3.5" />}

              {isLast || !item.href ? (
                <span className="text-white-primary text-sm leading-5 font-medium">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="hover:text-white-primary text-muted text-sm leading-5 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {!isLoading && user && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button type="button" className="cursor-pointer outline-none">
              <Avatar.Root className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full">
                {avatarUrl && (
                  <Avatar.Image
                    className="border-green h-full w-full rounded-full border-2 object-cover"
                    src={avatarUrl}
                    alt={displayName}
                  />
                )}
                <Avatar.Fallback className="text-white-primary border-green bg-bg-secondary flex h-full w-full items-center justify-center rounded-full border-2 text-sm font-medium">
                  {initials}
                </Avatar.Fallback>
              </Avatar.Root>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="bg-bg-secondary border-dark z-50 min-w-30 overflow-hidden rounded-lg border p-1 shadow-lg"
            >
              <div className="flex items-center gap-3 px-3 py-2.5">
                <Avatar.Root className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full">
                  {avatarUrl && (
                    <Avatar.Image
                      className="border-green h-full w-full rounded-full border-2 object-cover"
                      src={avatarUrl}
                      alt={displayName}
                    />
                  )}
                  <Avatar.Fallback className="text-white-primary border-green bg-bg-secondary flex h-full w-full items-center justify-center rounded-full border-2 text-sm font-medium">
                    {initials}
                  </Avatar.Fallback>
                </Avatar.Root>

                <div className="min-w-0 flex-1">
                  <p className="text-white-primary truncate text-sm font-medium">
                    {displayName}
                  </p>
                  <p className="text-muted truncate text-xs">{user.email}</p>
                </div>
              </div>

              <DropdownMenu.Separator className="bg-dark my-1 h-px" />

              <DropdownMenu.Item
                onSelect={handleLogout}
                className="text-white-primary hover:bg-dark focus:bg-dark flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors outline-none"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
    </header>
  );
}
