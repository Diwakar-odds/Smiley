import { DataTypes } from "sequelize";

export default function OtpModel(sequelize) {
  const Otp = sequelize.define(
    "Otp",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: () => new Date(Date.now() + 10 * 60000), // OTP expires in 10 minutes
      },
    },
    {
      timestamps: true,
      indexes: [
        {
          fields: ["expiresAt"],
          // We'll use a scheduled task to delete expired OTPs since PostgreSQL doesn't have TTL indexes like MongoDB
        },
      ],
    }
  );
  return Otp;
}
