export interface MenuItem {
  label: string;
  value: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}
