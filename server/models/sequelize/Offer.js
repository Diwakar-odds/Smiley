import { DataTypes } from "sequelize";
import { sequelize } from "../../config/sqlDb.js";

const Offer = sequelize.define(
  "Offer",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    discount: {
      type: DataTypes.STRING,
    },
    externalUrl: {
      type: DataTypes.STRING,
    },
    startDate: {
      type: DataTypes.DATE,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    categories: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    locales: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    storeId: {
      type: DataTypes.UUID,
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

export default Offer;
