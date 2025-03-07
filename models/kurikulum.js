"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kurikulum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      Kurikulum.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      Kurikulum.belongsTo(models.Semester, { foreignKey: "id_semester" });

      // relasi tabel child
      Kurikulum.hasMany(models.DetailKurikulum, { foreignKey: "id_kurikulum" });
      Kurikulum.hasMany(models.MatkulKurikulum, { foreignKey: "id_kurikulum" });
    }
  }
  Kurikulum.init(
    {
      id_kurikulum: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
      },
      nama_kurikulum: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      semester_mulai_berlaku: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      jumlah_sks_lulus: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: false,
      },
      jumlah_sks_wajib: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: false,
      },
      jumlah_sks_pilihan: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: false,
      },
      jumlah_sks_mata_kuliah_wajib: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: true,
      },
      jumlah_sks_mata_kuliah_pilihan: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: true,
      },
      last_sync: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      id_feeder: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      id_prodi: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_semester: {
        type: DataTypes.CHAR(5),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Kurikulum",
      tableName: "kurikulums",
    }
  );
  return Kurikulum;
};
