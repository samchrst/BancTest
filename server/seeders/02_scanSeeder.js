'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insérer des données dans la table 'scan'
    await queryInterface.bulkInsert('scan', [
      {
        scan_rack_id: 1,  // Exemple de rack_id, à adapter selon ton besoin
        createdAt: new Date(),  // Date actuelle
      },
      {
        scan_rack_id: 2,  // Autre exemple de rack_id
        createdAt: new Date(),
      },
        {
            scan_rack_id: 3,  // Autre exemple de rack_id
            createdAt: new Date(),
        },
        {
            scan_rack_id: 4,  // Autre exemple de rack_id
            createdAt: new Date(),
        },
        {
            scan_rack_id: 5,  // Autre exemple de rack_id
            createdAt: new Date(),
        },

    ]);
  },

  async down(queryInterface, Sequelize) {
    // Supprimer les données insérées dans 'scan'
    await queryInterface.bulkDelete('scan', null, {});
  },
};
