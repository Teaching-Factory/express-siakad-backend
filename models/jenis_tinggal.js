"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JenisTinggal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      JenisTinggal.hasMany(models.BiodataMahasiswa, { foreignKey: "id_jenis_tinggal" });
      JenisTinggal.hasMany(models.DataLengkapMahasiswaProdi, { foreignKey: "id_jenis_tinggal" });
      JenisTinggal.hasMany(models.BiodataCamaba, { foreignKey: "id_jenis_tinggal" });
    }
  }
  JenisTinggal.init(
    {
      id_jenis_tinggal: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.DECIMAL(2, 0)
      },
      nama_jenis_tinggal: {
        type: DataTypes.STRING(50),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "JenisTinggal",
      tableName: "jenis_tinggals"
    }
  );
  return JenisTinggal;
};
