// Migration: Change MenuItem id from UUID to auto-incrementing integer (PostgreSQL)
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Rename old id column
    await queryInterface.renameColumn("MenuItems", "id", "old_id");
    // 2. Add new integer id column
    await queryInterface.addColumn("MenuItems", "id", {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    });
    // 3. If you have foreign keys referencing MenuItems.id, update them here
    // (You may need to update related tables and data)
    // 4. Drop old_id column
    await queryInterface.removeColumn("MenuItems", "old_id");
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback: Not implemented (would require data migration)
    throw new Error("Down migration not implemented.");
  },
};
