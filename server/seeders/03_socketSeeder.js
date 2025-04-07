'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insérer des données dans la table 'socket'
    await queryInterface.bulkInsert('socket', [
      {
        socket_ip: '192.168.1.1',   
        socket_rack_id: 1,          
      },
      {
        socket_ip: '192.168.1.2',
        socket_rack_id: 2,
      },
      {
        socket_ip: '192.168.1.3',
        socket_rack_id: 3,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Supprimer les données insérées dans 'socket'
    await queryInterface.bulkDelete('socket', null, {});
  },
};
