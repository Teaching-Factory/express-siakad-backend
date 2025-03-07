"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("detail_kurikulums", {
      id_detail_kurikulum: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      sks_wajib: {
        type: Sequelize.DECIMAL(3, 0),
        allowNull: true,
      },
      sks_pilihan: {
        type: Sequelize.DECIMAL(3, 0),
        allowNull: true,
      },
      id_kurikulum: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "kurikulums",
          },
          key: "id_kurikulum",
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
    await queryInterface.dropTable("detail_kurikulums");
  },
};
