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
      TagihanMahasiswa.belongsTo(models.JenisTagihan, { foreignKey: "id_jenis_tagihan" });
      TagihanMahasiswa.belongsTo(models.Semester, { foreignKey: "id_semester" });
      TagihanMahasiswa.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });

      // relasi tabel child
      TagihanMahasiswa.hasMany(models.PembayaranMahasiswa, { foreignKey: "id_tagihan_mahasiswa" });
    }
  }
  TagihanMahasiswa.init(
    {
      id_tagihan_mahasiswa: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
      },
      jumlah_tagihan: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        validate: {
          isInt: {
            args: true,
            msg: "jumlah_tagihan must be an integer",
          },
        },
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
      id_jenis_tagihan: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        validate: {
          isInt: {
            args: true,
            msg: "id_jenis_tagihan must be an integer",
          },
        },
      },
      id_semester: {
        type: DataTypes.CHAR(5),
        allowNull: false,
      },
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(36),
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
