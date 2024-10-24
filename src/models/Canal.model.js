const mongoose = require('mongoose');

const canalSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['texto', 'voz'],
    default: 'texto'
  },
  comunidad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comunidad',
    required: true
  },
  mensajes: [{
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario'
    },
    contenido: {
      type: String,
      required: true
    },
    fechaEnvio: {
      type: Date,
      default: Date.now
    }
  }],
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Canal = mongoose.model('Canal', canalSchema);

module.exports = Canal;
