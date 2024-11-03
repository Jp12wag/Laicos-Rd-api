const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  tipo: String, // Ej. "Creación", "Actualización", "Eliminación"
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
  descripcion: String,
  fecha: { type: Date, default: Date.now },
  detalles: mongoose.Schema.Types.Mixed // Datos adicionales como el campo modificado y su valor anterior
});

module.exports = mongoose.model('Log', logSchema);