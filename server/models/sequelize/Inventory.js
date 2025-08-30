import { DataTypes } from "sequelize";
import { sequelize } from "../../config/sqlDb.js";

const Inventory = sequelize.define(
  "Inventory",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    menuItemId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "MenuItems",
        key: "id",
      },
      field: "menuItemId", // renamed from mealId to be consistent
    },
    storeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Stores",
        key: "id",
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    threshold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    lastUpdated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeSave: (inventory) => {
        inventory.lastUpdated = new Date();
      },
    },
  }
);

export default Inventory;
