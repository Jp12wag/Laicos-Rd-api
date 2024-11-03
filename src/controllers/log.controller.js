// controllers/logController.js
const Log = require('../models/log.model');

exports.crearLog = async (tipo, usuarioId, descripcion, detalles = {}) => {
  try {
    const log = new Log({
      tipo,
      usuario: usuarioId,
      descripcion,
      detalles
    });
    await log.save();
  } catch (error) {
    console.error("Error al guardar el log:", error);
  }
};

exports.obtenerLogs = async (req, res) => {
  try {
    const logs = await Log.find().populate('admin', 'nombre').sort({ fecha: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los logs" });
  }
};
