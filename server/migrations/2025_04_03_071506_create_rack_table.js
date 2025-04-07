'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rack', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      nbSocket: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      nbSeringue: {
        type: Sequelize.BIGINT,
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rack');
  }
};
