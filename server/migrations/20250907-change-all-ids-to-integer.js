// Migration: Convert all UUID IDs and foreign keys to INTEGER for all relevant tables
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // MenuItems
    await queryInterface.renameColumn("MenuItems", "id", "old_id");
    await queryInterface.addColumn("MenuItems", "id", {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    });
    await queryInterface.renameColumn("MenuItems", "storeId", "old_storeId");
    await queryInterface.addColumn("MenuItems", "storeId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // Orders
    await queryInterface.renameColumn("Orders", "id", "old_id");
    await queryInterface.addColumn("Orders", "id", {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    });
    await queryInterface.renameColumn("Orders", "storeId", "old_storeId");
    await queryInterface.addColumn("Orders", "storeId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // OrderItems
    await queryInterface.renameColumn("OrderItems", "id", "old_id");
    await queryInterface.addColumn("OrderItems", "id", {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    });
    await queryInterface.renameColumn("OrderItems", "orderId", "old_orderId");
    await queryInterface.addColumn("OrderItems", "orderId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.renameColumn(
      "OrderItems",
      "menuItemId",
      "old_menuItemId"
    );
    await queryInterface.addColumn("OrderItems", "menuItemId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // Stores
    await queryInterface.renameColumn("Stores", "id", "old_id");
    await queryInterface.addColumn("Stores", "id", {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    });

    // Reviews
    await queryInterface.renameColumn("Reviews", "id", "old_id");
    await queryInterface.addColumn("Reviews", "id", {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    });
    await queryInterface.renameColumn("Reviews", "userId", "old_userId");
    await queryInterface.addColumn("Reviews", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.renameColumn(
      "Reviews",
      "menuItemId",
      "old_menuItemId"
    );
    await queryInterface.addColumn("Reviews", "menuItemId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.renameColumn("Reviews", "storeId", "old_storeId");
    await queryInterface.addColumn("Reviews", "storeId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // Inventories
    await queryInterface.renameColumn("Inventories", "id", "old_id");
    await queryInterface.addColumn("Inventories", "id", {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    });
    await queryInterface.renameColumn(
      "Inventories",
      "menuItemId",
      "old_menuItemId"
    );
    await queryInterface.addColumn("Inventories", "menuItemId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.renameColumn("Inventories", "storeId", "old_storeId");
    await queryInterface.addColumn("Inventories", "storeId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // Offers
    await queryInterface.renameColumn("Offers", "id", "old_id");
    await queryInterface.addColumn("Offers", "id", {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    });
    await queryInterface.renameColumn("Offers", "storeId", "old_storeId");
    await queryInterface.addColumn("Offers", "storeId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // Addresses
    await queryInterface.renameColumn("Addresses", "id", "old_id");
    await queryInterface.addColumn("Addresses", "id", {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    });
    await queryInterface.renameColumn("Addresses", "userId", "old_userId");
    await queryInterface.addColumn("Addresses", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // After data migration, drop old columns and update foreign key constraints as needed.
    // You must also migrate data from old UUID columns to new INTEGER columns if you want to preserve relationships.
  },

  down: async (queryInterface, Sequelize) => {
    throw new Error("Down migration not implemented.");
  },
};
