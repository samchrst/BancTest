'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Socket extends Model {
    /**
     * Helper method for defining associations.
     * Cette méthode est automatiquement appelée par le fichier `models/index.js`.
     */

    static associate(models) {
      // Un socket appartient à un rack
      Socket.belongsTo(models.Rack, {
        foreignKey: 'socket_rack_id',
        as: 'rack'
      });
      // Un socket a plusieurs seringues
      Socket.hasMany(models.Seringue, {
        foreignKey: 'seringue_socket_Id',
        as: 'seringues'
      });
    }
  }    

  Socket.init({
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    socket_ip: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    socket_rack_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Socket',
    tableName: 'socket',
    timestamps: false  
  });

  return Socket;
};
