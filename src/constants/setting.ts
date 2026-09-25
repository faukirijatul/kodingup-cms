import type { MenuCategory } from "@/types/setting";

export const DEFAULT_ACTIVE_MENU = 'password';

export const SETTING_MENUS: MenuCategory[] = [
  {
    name: 'Authentication',
    items: [{ label: 'Password', value: 'password' }],
  },
  {
    name: 'Another',
    items: [
      { label: 'Test', value: 'test' },
      { label: 'Test 2', value: 'testLagi' },
    ],
  },
];