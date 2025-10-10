import { DataTypes } from "sequelize";

export default function AdminPushSubscriptionModel(sequelize) {
  const AdminPushSubscription = sequelize.define(
    "AdminPushSubscription",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      endpoint: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      p256dhKey: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      authKey: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      lastNotifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "admin_push_subscriptions",
      indexes: [
        {
          fields: ["adminId"],
        },
      ],
    }
  );

  return AdminPushSubscription;
}
