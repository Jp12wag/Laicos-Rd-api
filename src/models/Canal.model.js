const mongoose = require('mongoose');
const canalSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    enum: ['texto', 'voz'],
    required: true,
  },
  comunidad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comunidad',
    required: true,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  mensajes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mensaje',  // Aquí se hace referencia al modelo Mensaje
  }],
});

const Canal = mongoose.model('Canal', canalSchema);

module.exports = Canal;