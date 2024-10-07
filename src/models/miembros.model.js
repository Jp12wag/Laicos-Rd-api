const mongoose = require('mongoose');

const miembroSchema = new mongoose.Schema({
  Parroquia: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parroquia',
    required:false
  },
  idAdministrador: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
    required:   true
  },

  estadoCivil: { 
    type: String, 
    required: true 
  },
  direccion: { 
    type: String, 
    required: true 
  },
  cargo: { 
    type: String, 
    required: true 
  },
  nacionalidad: { 
    type: String, 
    required: true 
  }
});

const Miembro = mongoose.model('miembro', miembroSchema);

module.exports = Miembro;
