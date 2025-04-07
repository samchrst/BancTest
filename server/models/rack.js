'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rack extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //un rack a plusieurs sockets
      Rack.hasMany(models.Socket, {
        foreignKey: 'socket_rack_id',
        as: 'sockets'
      });
    }
  }

  Rack.init({
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    nbSocket: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    nbSeringue: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Rack',
    tableName: 'rack',  // Nom de la table dans la base de données
    timestamps: false    // Sequelize ajoutera `createdAt` et `updatedAt`
  });

  return Rack;
};
