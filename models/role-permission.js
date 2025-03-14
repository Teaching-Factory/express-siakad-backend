"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      RolePermission.belongsTo(models.Role, { foreignKey: "id_role" });
      RolePermission.belongsTo(models.Permission, { foreignKey: "id_permission" });
    }
  }
  RolePermission.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(20),
      },
      id_role: {
        type: DataTypes.INTEGER(20),
        allowNull: false,
      },
      id_permission: {
        type: DataTypes.INTEGER(20),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "RolePermission",
      tableName: "role_permissions",
    }
  );
  return RolePermission;
};
