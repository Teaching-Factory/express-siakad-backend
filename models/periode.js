"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Periode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Periode.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
    }
  }
  Periode.init(
    {
      periode_pelaporan: {
        type: DataTypes.CHAR(5),
        allowNull: false,
      },
      tipe_periode: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
      },
      id_prodi: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Periode",
      tableName: "periodes",
    }
  );
  return Periode;
};