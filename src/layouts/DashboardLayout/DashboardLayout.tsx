import { useCallback, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import * as Tooltip from '@radix-ui/react-tooltip';
import { KodingUpLogo } from '@/components/icons/KodingUpLogo';
import { KodingUpLogoWithText } from '@/components/icons/KodingUpLogoWithText';
import { IconCloseSidebar } from '@/components/icons/IconCloseSidebar';
import { NAVIGATION_ITEMS } from './constants';
import { NavItem } from './NavItem';

export function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <div className="bg-bg-primary flex min-h-screen">
      <Tooltip.Provider delayDuration={200}>
        <aside
          className={`border-dark relative border-r transition-all duration-200 ${
            isCollapsed ? 'w-12' : 'min-w-70'
          }`}
        >
          <button
            type="button"
            onClick={handleToggleSidebar}
            className={`bg-bg-primary border-dark z-10 h-7 w-7 cursor-pointer rounded-[6px] border p-1.25 ${
              isCollapsed
                ? 'relative left-2.5 mt-3 mb-1'
                : 'absolute top-5.25 -right-3'
            }`}
          >
            <IconCloseSidebar
              className={`transition-transform duration-200 ${
                isCollapsed ? 'rotate-180' : ''
              }`}
            />
          </button>

          <div
            className={`border-dark flex h-17.5 items-center gap-2 border-b py-4.5 ${
              isCollapsed ? 'justify-center px-0' : 'px-6'
            }`}
          >
            <Link to={'/students/enrolled'}>
              {isCollapsed ? <KodingUpLogo /> : <KodingUpLogoWithText />}
            </Link>
            {!isCollapsed && (
              <span className="text-white-primary h-7 pt-2 text-sm leading-5 font-normal opacity-50">
                Admin
              </span>
            )}
          </div>

          <nav
            className={`flex flex-col ${
              isCollapsed ? 'px-3' : 'pt-5 pr-4.75 pl-6'
            }`}
          >
            {!isCollapsed && (
              <p className="text-muted-alpha h-6.5 px-2 pt-2.25 pb-px text-xs leading-4 font-medium uppercase">
                Main Menu
              </p>
            )}

            {NAVIGATION_ITEMS.map((item) => (
              <NavItem
                key={item.path}
                path={item.path}
                label={item.label}
                icon={item.icon}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>
        </aside>
      </Tooltip.Provider>

      <Outlet />
    </div>
  );
}
