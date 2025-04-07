const { Rack } = require('../models');  // Import du modèle Rack

// Récupérer tous les racks avec leurs sockets associés
exports.getAllRacks = async (req, res) => {
  try {
    console.log('Modèle Rack:', Rack);  // Vérifie si le modèle est bien défini
    const racks = await Rack.findAll({
      include: {
        model: require('../models').Socket,  // Inclure le modèle Socket
        as: 'sockets',  // Nom de l'association définie dans Rack
        attributes: ['id', 'socket_ip'],  // Sélectionner les attributs que tu veux pour les sockets
      }
    });

    // Transformer les données pour renvoyer un format personnalisé
    const racksData = racks.map(rack => ({
      rackId: rack.id,
      nbSocket: rack.nbSocket,
      nbSeringue: rack.nbSeringue,
      sockets: rack.sockets.map(socket => socket.socket_ip)  // Liste des IP des sockets
    }));

    res.status(200).json(racksData);  // Retourner les racks avec leurs sockets
  } catch (error) {
    console.error('Erreur serveur :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer un rack par son ID
exports.getRackById = async (req, res) => {
  const { id } = req.params;
  try {
    const rack = await Rack.findByPk(id);  // Chercher le rack par son ID
    if (!rack) {
      return res.status(404).json({ error: 'Rack non trouvé' });
    }
    res.status(200).json(rack);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Créer un nouveau rack
exports.createRack = async (req, res) => {
  const { nbSocket, nbSeringue } = req.body;
  try {
    const rack = await Rack.create({ nbSocket, nbSeringue });
    res.status(201).json(rack);  // Retourner le rack créé
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Mettre à jour un rack par son ID
exports.updateRack = async (req, res) => {
  const { id } = req.params;
  const { nbSocket, nbSeringue } = req.body;
  try {
    const rack = await Rack.findByPk(id);  // Chercher le rack par son ID
    if (!rack) {
      return res.status(404).json({ error: 'Rack non trouvé' });
    }
    rack.nbSocket = nbSocket;  // Mettre à jour les champs
    rack.nbSeringue = nbSeringue;
    await rack.save();  // Sauvegarder les modifications
    res.status(200).json(rack);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Supprimer un rack par son ID
exports.deleteRack = async (req, res) => {
  const { id } = req.params;
  try {
    const rack = await Rack.findByPk(id);
    if (!rack) {
      return res.status(404).json({ error: 'Rack non trouvé' });
    }
    await rack.destroy();  // Supprimer le rack
    res.status(204).json({ message: 'Rack supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
