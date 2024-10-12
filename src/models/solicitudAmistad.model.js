// models/solicitudAmistad.model.js
const mongoose = require('mongoose');

const SolicitudAmistadSchema = new mongoose.Schema({
  emisor: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true },
  receptor: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true },
  estado: { 
    type: String, 
    enum: ['pendiente', 'aceptada', 'rechazada'], 
    default: 'pendiente' 
  },
  fechaEnvio: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SolicitudAmistad', SolicitudAmistadSchema);
