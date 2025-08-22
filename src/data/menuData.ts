// src/data/menuData.ts
export interface MenuItemData {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export const menuData: MenuItemData[] = [
  {
    _id: "1",
    name: "Aloo Patty",
    description: "Crispy aloo filled with tangy tomato",
    price: 30,
    imageUrl: "/images/aloo-patty.jpg",
    category: "patties",
  },
  {
    _id: "2",
    name: "Chocolate Shake",
    description: "Rich creamy shake with chocolate syrup",
    price: 80,
    imageUrl: "/images/choco-shake.jpg",
    category: "shakes",
  },
  {
    _id: "3",
    name: "Vanilla Softy",
    description: "Classic vanilla soft-serve cone",
    price: 25,
    imageUrl: "/images/vanilla-softy.jpg",
    category: "softy",
  },
  {
    _id: "4",
    name: "Combo Pack",
    description: "Patty + Shake + Softy at a special price",
    price: 120,
    imageUrl: "/images/combo.jpg",
    category: "combos",
  },
  {
    _id: "4",
    name: "Combo Pack",
    description: "Patty + Shake + Softy at a special price",
    price: 120,
    imageUrl: "/images/combo.jpg",
    category: "combos",
  },
  {
    _id: "4",
    name: "Combo Pack",
    description: "Patty + Shake + Softy at a special price",
    price: 120,
    imageUrl: "/images/combo.jpg",
    category: "combos",
  },
  {
    _id: "4",
    name: "Combo Pack",
    description: "Patty + Shake + Softy at a special price",
    price: 120,
    imageUrl: "/images/combo.jpg",
    category: "combos",
  },
];
