import { DataTypes } from "sequelize";

export default function MenuItemModel(sequelize) {
  const MenuItem = sequelize.define(
    "MenuItem",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      category: {
        type: DataTypes.ENUM(
          "softy",
          "patties",
          "shakes",
          "corn",
          "combos",
          "pastry"
        ),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
      available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      storeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Stores",
          key: "id",
        },
      },
    },
    {
      timestamps: true,
    }
  );
  return MenuItem;
}
