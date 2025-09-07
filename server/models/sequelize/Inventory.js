import { DataTypes } from "sequelize";

export default function InventoryModel(sequelize) {
  const Inventory = sequelize.define(
    "Inventory",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      menuItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "MenuItems",
          key: "id",
        },
        field: "menuItemId",
      },
      storeId: {
        type: DataTypes.INTEGER,
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
  return Inventory;
}
