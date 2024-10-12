const Conversacion = require('../models/coversacion.model');
const controllers = {};


controllers.obtenerConversaciones= async (req, res) => {
  try {
    const userId = req.userId; // Obtén el ID del usuario autenticado

    const conversaciones = await Conversacion.find({
      participantes: userId
    }).sort({ fechaUltimoMensaje: -1 });

    res.json({ conversaciones });
  } catch (error) {
    console.error('Error al obtener las conversaciones recientes:', error);
    res.status(500).json({ error: 'Error al obtener las conversaciones recientes' });
  }
}

module.exports = controllers;