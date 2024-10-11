const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mensajeSchema = new Schema({
  emisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
    required: true,
  },
  receptor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
    required: true,
  },
  mensaje: {
    type: String,
    required: true,
  },
  fechaEnvio: {
    type: Date,
    default: Date.now,
  },
  leido: {
    type: Boolean,
    default: false,
  },
});

const Mensaje = mongoose.model('Mensaje', mensajeSchema);
module.exports = Mensaje;