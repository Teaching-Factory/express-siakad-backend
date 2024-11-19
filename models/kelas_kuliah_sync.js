"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class KelasKuliahSync extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      KelasKuliahSync.belongsTo(models.KelasKuliah, { foreignKey: "id_kelas_kuliah" });
    }
  }
  KelasKuliahSync.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      jenis_singkron: {
        type: DataTypes.ENUM(["create", "update", "delete"]),
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      id_kelas_kuliah: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "KelasKuliahSync",
      tableName: "kelas_kuliah_syncs",
    }
  );
  return KelasKuliahSync;
};