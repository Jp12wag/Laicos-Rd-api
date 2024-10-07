const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CleroSchema = new Schema({
  idAdministrador: { type: mongoose.Schema.Types.ObjectId,ref: 'admin', required:   true
  },
    titulo: { type: String, required: true },  // Ejemplo: Sacerdote, Obispo, etc.
    parroquia: { type: mongoose.Schema.Types.ObjectId, ref: 'Parroquia', required: true },  // Relación con Parroquia
});

module.exports = mongoose.model('Clero', CleroSchema);
