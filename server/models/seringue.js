'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Seringue extends Model {
    /**
     * Méthode d'association
     */
    static associate(models) {
      // Définir l'association avec Socket
      Seringue.belongsTo(models.Socket, {
        foreignKey: 'seringue_socket_Id',
        as: 'socket'
      });
    }
  }

  Seringue.init({
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    seringue_socket_Id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'socket',  // Nom de la table cible
        key: 'id'         // Clé étrangère ciblée
      },
    },
  }, {
    sequelize,
    modelName: 'Seringue',
    tableName: 'seringue',  // Nom de la table dans la base de données
    timestamps: false       // Pas de champs 'createdAt' et 'updatedAt'
  });

  return Seringue;
};
