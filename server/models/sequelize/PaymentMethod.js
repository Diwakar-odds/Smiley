
import { DataTypes } from "sequelize";

export default function PaymentMethodModel(sequelize) {
  const PaymentMethod = sequelize.define(
    "PaymentMethod",
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
      cardNumber: {
        type: DataTypes.STRING,
        // In a production app, you'd want to encrypt this data
      },
      expiryDate: {
        type: DataTypes.STRING,
      },
      cvv: {
        type: DataTypes.STRING,
        // In a production app, you'd want to encrypt this data and not store it at all if possible
      },
    },
    {
      timestamps: true,
    }
  );
  return PaymentMethod;
}
