import { DataTypes } from "sequelize";

export default function OfferModel(sequelize) {
  const Offer = sequelize.define(
    "Offer",
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
      description: {
        type: DataTypes.TEXT,
      },
      bannerImage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      discountPercentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
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
    },
    {
      timestamps: true,
    }
  );
  return Offer;
}