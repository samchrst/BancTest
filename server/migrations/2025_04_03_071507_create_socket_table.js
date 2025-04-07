'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('socket', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      socket_ip: {
        type: Sequelize.STRING, // `char` en Laravel peut être `STRING` ici
        allowNull: false,
        unique: true
      },
      socket_rack_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'rack',  // Nom de la table cible
          key: 'id'       // Clé étrangère ciblée
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('socket');
  }
};
