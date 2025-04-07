'use strict';

const { Seringue } = require('../models'); // Assurez-vous que le chemin est correct selon votre structure de projet

module.exports = {
  async up(queryInterface, Sequelize) {
    // On ajoute des données exemple dans la table `seringue`
    await queryInterface.bulkInsert('seringue', [
      {
        seringue_socket_Id: 1, 
      },
      {
        seringue_socket_Id: 2, 
      },
      {
        seringue_socket_Id: 3, 
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // On supprime toutes les données dans la table `seringue` pour cette seed
    await queryInterface.bulkDelete('seringue', null, {});
  }
};
