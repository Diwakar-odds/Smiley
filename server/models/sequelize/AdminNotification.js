import { DataTypes } from "sequelize";

export default function AdminNotificationModel(sequelize) {
  const AdminNotification = sequelize.define(
    "AdminNotification",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("new", "acknowledged", "handled", "escalated"),
        allowNull: false,
        defaultValue: "new",
      },
      unread: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      acknowledgedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      handledBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      escalationLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      handledAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      escalatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: "admin_notifications",
      indexes: [
        {
          fields: ["status"],
        },
        {
          fields: ["orderId"],
        },
      ],
    }
  );

  return AdminNotification;
}
