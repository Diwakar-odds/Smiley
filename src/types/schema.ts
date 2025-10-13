// Type definitions to match backend database schema
export type OrderStatus = "pending" | "accepted" | "rejected" | "completed";
export type UserRole = "user" | "admin";
export type MenuCategory =
  | "softy"
  | "patties"
  | "shakes"
  | "corn"
  | "combos"
  | "pastry";

// Order-related interfaces
export interface OrderItem {
  id?: number;
  menuItemId: number;
  name: string;
  quantity: number;
  price: number;
  OrderItem?: {
    quantity: number;
    price: number;
  };
}

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

// Validation functions
export const isValidOrderStatus = (status: string): status is OrderStatus => {
  return ["pending", "accepted", "rejected", "completed"].includes(status);
};

export const isValidUserRole = (role: string): role is UserRole => {
  return ["user", "admin"].includes(role);
};

export const isValidMenuCategory = (
  category: string
): category is MenuCategory => {
  return ["softy", "patties", "shakes", "corn", "combos", "pastry"].includes(
    category
  );
};

// Price validation helper
export const validatePrice = (price: number): boolean => {
  return price >= 0 && Math.round(price * 100) === price * 100;
};

// ID validation helper
export const validateId = (id: any): id is number => {
  return typeof id === "number" && Number.isInteger(id) && id > 0;
};
