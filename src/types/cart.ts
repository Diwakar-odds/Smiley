import { MenuItemData } from '../data/menuData';

export interface CartItem extends MenuItemData {
  quantity: number;
}

export type { MenuItemData };
