const mongoose = require('mongoose');

const ConversacionSchema = new mongoose.Schema({
  participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'admin' }],
  ultimoMensaje: { type: String, required: true },
  fechaUltimoMensaje: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Conversacion', ConversacionSchema);
