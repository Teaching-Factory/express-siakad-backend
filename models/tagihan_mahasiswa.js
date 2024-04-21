"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TagihanMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      TagihanMahasiswa.belongsTo(models.Periode, { foreignKey: "id_periode" });
      TagihanMahasiswa.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });

      // relasi tabel child
      TagihanMahasiswa.hasMany(models.PembayaranMahasiswa, { foreignKey: "id_tagihan_mahasiswa" });
    }
  }
  TagihanMahasiswa.init(
    {
      jumlah_tagihan: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
      jenis_tagihan: {
        type: DataTypes.ENUM("SPP", "KRS", "Yudisium", "Wisuda"),
        allowNull: false,
      },
      tanggal_tagihan: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      deadline_tagihan: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status_tagihan: {
        type: DataTypes.ENUM("Lunas", "Belum Bayar", "Belum Lunas"),
        allowNull: false,
      },
      id_periode: {
        type: DataTypes.CHAR(5),
        allowNull: false,
      },
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "TagihanMahasiswa",
      tableName: "tagihan_mahasiswas",
    }
  );
  return TagihanMahasiswa;
};