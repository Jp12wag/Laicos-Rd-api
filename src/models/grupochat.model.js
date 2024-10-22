const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const grupoChatSchema = new Schema({
  parroquia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parroquia',
    required: true,
  },
  miembros: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
  }],
  mensajes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mensaje',
  }],
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

const GrupoChat = mongoose.model('GrupoChat', grupoChatSchema);
module.exports = GrupoChat;
