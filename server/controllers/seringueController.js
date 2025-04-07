const { Seringue } = require('../models'); // Assurez-vous d'ajuster le chemin selon votre structure de projet

// Créer une nouvelle seringue
exports.createSeringue = async (req, res) => {
  try {
    const { seringue_socket_Id } = req.body;

    // Création d'une nouvelle seringue
    const newSeringue = await Seringue.create({
      seringue_socket_Id,
    });

    res.status(201).json(newSeringue);
  } catch (error) {
    console.error('Error creating seringue:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Récupérer toutes les seringues
exports.getAllSeringues = async (req, res) => {
  try {
    const seringues = await Seringue.findAll({
      include: {
        model: require('../models').Socket, // Assurez-vous que le modèle Socket est correctement importé
        as: 'socket', // Alias d'association défini dans le modèle
      },
    });

    res.status(200).json(seringues);
  } catch (error) {
    console.error('Error fetching seringues:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Récupérer une seringue par son ID
exports.getSeringueById = async (req, res) => {
  try {
    const { id } = req.params;

    const seringue = await Seringue.findByPk(id, {
      include: {
        model: require('../models').Socket,
        as: 'socket',
      },
    });

    if (!seringue) {
      return res.status(404).json({ message: 'Seringue not found' });
    }

    res.status(200).json(seringue);
  } catch (error) {
    console.error('Error fetching seringue:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Mettre à jour une seringue
exports.updateSeringue = async (req, res) => {
  try {
    const { id } = req.params;
    const { seringue_socket_Id } = req.body;

    const seringue = await Seringue.findByPk(id);

    if (!seringue) {
      return res.status(404).json({ message: 'Seringue not found' });
    }

    seringue.seringue_socket_Id = seringue_socket_Id;
    await seringue.save();

    res.status(200).json(seringue);
  } catch (error) {
    console.error('Error updating seringue:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Supprimer une seringue
exports.deleteSeringue = async (req, res) => {
  try {
    const { id } = req.params;

    const seringue = await Seringue.findByPk(id);

    if (!seringue) {
      return res.status(404).json({ message: 'Seringue not found' });
    }

    await seringue.destroy();
    res.status(200).json({ message: 'Seringue deleted successfully' });
  } catch (error) {
    console.error('Error deleting seringue:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
