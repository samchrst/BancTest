'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Scan extends Model {
    /**
     * Helper method for defining associations.
     * Cette méthode est automatiquement appelée par le fichier `models/index.js`.
     */
    static associate(models) {
      // Association avec Rack
      Scan.belongsTo(models.Rack, {
        foreignKey: 'scan_rack_id',
        as: 'rack'
      });
    }
  }

  Scan.init({
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    scan_rack_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Scan',
    tableName: 'scan',
    timestamps: false  // Pas de champs `updatedAt` dans cette table, uniquement `createdAt`
  });

  return Scan;
};
