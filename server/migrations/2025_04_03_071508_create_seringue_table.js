'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('seringue', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      seringue_socket_Id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'socket',  
          key: 'id'         
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('seringue');
  }
};
