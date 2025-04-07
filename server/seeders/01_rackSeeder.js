'use_strict';

module.exports = {
    up:async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Rack', [
            {
                nbSocket: 10,
                nbSeringue: 50,
            },
            {
                nbSocket: 5,
                nbSeringue: 25,
            },
            {
                nbSocket: 15,
                nbSeringue: 75,
            },
            {
                nbSocket: 20,
                nbSeringue: 100,
            },
            {
                nbSocket: 8,
                nbSeringue: 40,
            },
            {
                nbSocket: 12,
                nbSeringue: 60,
            },
        ], {});
    }
    ,

    down:async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Rack', null, {});
    }
};