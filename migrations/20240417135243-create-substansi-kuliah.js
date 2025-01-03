"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("substansi_kuliahs", {
      id_subtansi_kuliah: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      tgl_create: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_DATE"),
      },
      last_update: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_DATE"),
      },
      id_substansi: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "substansis",
          },
          key: "id_substansi",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("substansi_kuliahs");
  },
};
