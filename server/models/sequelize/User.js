import { DataTypes } from "sequelize";
import { sequelize } from "../../config/sqlDb.js";
import bcrypt from "bcryptjs";
export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Please provide a valid email address",
          },
        },
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profilePic: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("user", "admin"),
        defaultValue: "user",
      },
      resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lastPaymentMethodId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "PaymentMethods",
          key: "id",
        },
      },
    },
    {
      tableName: "Users",
    }
  );

  return User;
};
