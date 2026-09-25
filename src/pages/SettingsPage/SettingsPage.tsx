import { useCallback, useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { DEFAULT_ACTIVE_MENU, SETTING_MENUS } from '@/constants/setting';
import { cn } from '@/lib/utils';
import { PasswordSettingForm } from './components/PasswordSettingForm';

const RENDER_SETTING_CONTENT: Record<string, React.ReactNode> = {
  password: <PasswordSettingForm />,
  test: <div>Test Content</div>,
  testLagi: <div>Test Lagi Content</div>,
};

export function SettingsPage() {
  const [activeMenu, setActiveMenu] = useState(DEFAULT_ACTIVE_MENU);

  const breadcrumbs = useMemo(() => [{ label: 'Settings' }], []);

  const handleClickMenuItem = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const value = event.currentTarget.dataset.value;
      setActiveMenu(value || DEFAULT_ACTIVE_MENU);
    },
    [],
  );

  return (
    <div className="flex w-full flex-col">
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <div className="flex items-start justify-between gap-7.5 px-6">
        <div className="flex w-57.5 flex-col">
          {SETTING_MENUS.map((category) => (
            <div className="flex w-full flex-col" key={category.name}>
              <div className="h-10 p-2.5 pl-6">
                <p className="text-white-primary text-sm leading-5 font-semibold tracking-normal">
                  {category.name}
                </p>
              </div>

              <div className="w-full space-y-1.5">
                {category.items.map((item) => {
                  const isActive = item.value === activeMenu;

                  return (
                    <button
                      key={item.value}
                      onClick={handleClickMenuItem}
                      data-value={item.value}
                      className="h-8.5 w-full cursor-pointer"
                    >
                      <div
                        className={cn(
                          'flex h-8 w-full items-center justify-start gap-3.5 rounded-md px-2.5 py-1.5 transition-colors',
                          isActive
                            ? 'bg-bg-secondary'
                            : 'hover:bg-bg-secondary',
                        )}
                      >
                        <div
                          className={cn(
                            'h-1.5 w-1.5 rounded-full',
                            isActive ? 'bg-blue' : 'bg-white-primary',
                          )}
                        />
                        <span
                          className={cn(
                            'text-sm leading-5 font-medium',
                            isActive ? 'text-blue' : 'text-white-primary',
                          )}
                        >
                          {item.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1">
          {RENDER_SETTING_CONTENT[activeMenu] ??
            RENDER_SETTING_CONTENT[DEFAULT_ACTIVE_MENU]}
        </div>
      </div>
    </div>
  );
}
