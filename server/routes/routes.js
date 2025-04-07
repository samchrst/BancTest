const express = require('express');
const router = express.Router();
const rackController = require('../controllers/rackController');
const seringueController = require('../controllers/seringueController'); 
const socketController = require('../controllers/socketController');
const scanController = require('../controllers/scanController');

// Définir les routes pour les racks
router.get('/racks', rackController.getAllRacks);           
router.get('/racks/:id', rackController.getRackById);       
router.post('/racks', rackController.createRack);           
router.put('/racks/:id', rackController.updateRack);        
router.delete('/racks/:id', rackController.deleteRack);     

// Routes pour les seringues
router.post('/seringues', seringueController.createSeringue);
router.get('/seringues', seringueController.getAllSeringues);
router.get('/seringues/:id', seringueController.getSeringueById);
router.put('/seringues/:id', seringueController.updateSeringue);
router.delete('/seringues/:id', seringueController.deleteSeringue);

// Routes pour les sockets
router.post('/sockets', socketController.create);
router.get('/sockets', socketController.getAll);
router.get('/sockets/:id', socketController.getById);
router.put('/sockets/:id', socketController.update);
router.delete('/sockets/:id', socketController.delete);

// Routes pour les scans
router.post('/scans', scanController.create);
router.get('/scans', scanController.getAll);
router.get('/scans/:id', scanController.getById);
router.put('/scans/:id', scanController.update);
router.delete('/scans/:id', scanController.delete);
router.post('/scan', scanController.scan); 


router.post('/ping', scanController.ping);

module.exports = router;
