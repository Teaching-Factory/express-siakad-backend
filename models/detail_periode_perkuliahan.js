"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailPeriodePerkuliahan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      DetailPeriodePerkuliahan.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      DetailPeriodePerkuliahan.belongsTo(models.Semester, { foreignKey: "id_semester" });
    }
  }
  DetailPeriodePerkuliahan.init(
    {
      id_detail_periode_perkuliahan: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      jumlah_target_mahasiswa_baru: {
        type: DataTypes.DECIMAL(6, 0),
        allowNull: true,
      },
      jumlah_pendaftar_ikut_seleksi: {
        type: DataTypes.DECIMAL(6, 0),
        allowNull: true,
      },
      jumlah_pendaftar_lulus_seleksi: {
        type: DataTypes.DECIMAL(6, 0),
        allowNull: true,
      },
      jumlah_daftar_ulang: {
        type: DataTypes.DECIMAL(6, 0),
        allowNull: true,
      },
      jumlah_mengundurkan_diri: {
        type: DataTypes.DECIMAL(5, 0),
        allowNull: true,
      },
      tanggal_awal_perkuliahan: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      tanggal_akhir_perkuliahan: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      jumlah_minggu_pertemuan: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: true,
      },
      id_prodi: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "prodis",
          },
          key: "id_prodi",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_semester: {
        type: DataTypes.CHAR(5),
        allowNull: false,
        references: {
          model: {
            tableName: "semesters",
          },
          key: "id_semester",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "DetailPeriodePerkuliahan",
      tableName: "detail_periode_perkuliahans",
    }
  );
  return DetailPeriodePerkuliahan;
};
