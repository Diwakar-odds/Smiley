import { DataTypes } from "sequelize";

export default function ReviewModel(sequelize) {
  const Review = sequelize.define(
    "Review",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      menuItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "MenuItems",
          key: "id",
        },
      },
      storeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Stores",
          key: "id",
        },
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      comment: {
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: true,
    }
  );
  return Review;
}
