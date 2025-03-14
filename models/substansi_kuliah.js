"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SubstansiKuliah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      SubstansiKuliah.belongsTo(models.Substansi, { foreignKey: "id_substansi" });
    }
  }
  SubstansiKuliah.init(
    {
      id_subtansi_kuliah: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
      },
      tgl_create: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      last_update: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      id_substansi: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SubstansiKuliah",
      tableName: "substansi_kuliahs",
      hooks: {
        beforeCreate: (instance, options) => {
          instance.tgl_create = new Date().toISOString().split("T")[0];
        },
        beforeUpdate: (instance, options) => {
          instance.last_update = new Date().toISOString().split("T")[0];
        },
      },
    }
  );
  return SubstansiKuliah;
};
