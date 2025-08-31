import { DataTypes } from "sequelize";

export default function OrderModel(sequelize) {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      storeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Stores",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      specialRequests: {
        type: DataTypes.TEXT,
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected", "completed"),
        defaultValue: "pending",
      },
    },
    {
      timestamps: true,
    }
  );
  return Order;
}
