// src/data/menuData.ts
export interface MenuItemData {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: "softy" | "patties" | "shakes" | "corn" | "combos" | "pastry"; // Match backend enum
}

export const menuData: MenuItemData[] = [
  {
    id: 1,
    name: "Aloo Patty",
    description: "Crispy aloo filled with tangy tomato",
    price: 30,
    imageUrl: "/images/aloo-patty.jpg",
    category: "patties",
  },
  {
    id: 2,
    name: "Chocolate Shake",
    description: "Rich creamy shake with chocolate syrup",
    price: 80,
    imageUrl: "/images/choco-shake.jpg",
    category: "shakes",
  },
  {
    id: 3,
    name: "Vanilla Softy",
    description: "Classic vanilla soft-serve cone",
    price: 25,
    imageUrl: "/images/vanilla-softy.jpg",
    category: "softy",
  },
  {
    id: 4,
    name: "Combo Pack",
    description: "Patty + Shake + Softy at a special price",
    price: 120,
    imageUrl: "/images/combo.jpg",
    category: "combos",
  },
  {
    id: 5,
    name: "Corn Cheese",
    description: "Sweet corn with melted cheese",
    price: 50,
    imageUrl: "/images/corn-cheese.jpg",
    category: "corn",
  },
  {
    id: 6,
    name: "Strawberry Pastry",
    description: "Soft pastry with strawberry flavor",
    price: 40,
    imageUrl: "/images/strawberry-pastry.jpg",
    category: "pastry",
  },
  {
    id: 7,
    name: "Deluxe Combo",
    description: "All-in-one combo for foodies",
    price: 200,
    imageUrl: "/images/deluxe-combo.jpg",
    category: "combos",
  },
];
