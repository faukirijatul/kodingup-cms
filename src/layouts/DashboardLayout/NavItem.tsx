import { NavLink } from 'react-router-dom';
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';
import type { MenuIconProps } from '@/types/icon';

type NavItemProps = {
  path: string;
  label: string;
  icon: React.ComponentType<MenuIconProps>;
  isCollapsed: boolean;
};

export function NavItem({
  path,
  label,
  icon: Icon,
  isCollapsed,
}: NavItemProps) {
  if (isCollapsed) {
    return (
      <div className="flex justify-center">
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <NavLink
              to={path}
              className="hover:bg-bg-secondary h-10 w-10 flex-1 rounded-md p-3 transition-colors"
            >
              {({ isActive }) => (
                <Icon color={isActive ? '#155DFC' : '#FAFAFA'} />
              )}
            </NavLink>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="right"
              sideOffset={8}
              className="text-white-primary bg-bg-secondary border-dark z-50 rounded-md border px-3 py-1.5 text-sm font-medium shadow-md select-none"
            >
              {label}
              <Tooltip.Arrow className="fill-bg-secondary" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>
    );
  }

  return (
    <NavLink to={path} className="h-11 w-full pt-3">
      {({ isActive }) => (
        <div
          className={cn(
            'flex h-8 items-center justify-start gap-2 rounded-md px-2 py-2.5 transition-colors',
            isActive ? 'bg-bg-secondary' : 'hover:bg-bg-secondary',
          )}
        >
          <Icon color={isActive ? '#155DFC' : '#FAFAFA'} />
          <span
            className={cn(
              'text-sm leading-5 font-medium',
              isActive ? 'text-blue' : 'text-white-primary',
            )}
          >
            {label}
          </span>
        </div>
      )}
    </NavLink>
  );
}
