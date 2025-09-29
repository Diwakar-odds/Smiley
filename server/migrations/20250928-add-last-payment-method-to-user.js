import { DataTypes } from "sequelize";

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "lastPaymentMethodId", {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "PaymentMethods",
        key: "id",
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "lastPaymentMethodId");
  },
};
