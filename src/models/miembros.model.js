const mongoose = require('mongoose');

const miembroSchema = new mongoose.Schema({
  idParroquia: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parroquia',
    required: false 
  },
  nombre: { 
    type: String, 
    required: true 
  },
  apellido: {
     type: String, 
     required: true 
  },
  sexo: { 
    type: String, 
    required: true 
  },
  estadoCivil: { 
    type: String, 
    required: true 
  },
  email: {
     type: String, 
     unique: true,
     required: true 
  },
  celular: { 
    type: String, 
    required: true 
  },
  fechaNacimiento: { 
    type: Date, 
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
  },
  esLaico: {
     type: Boolean, 
     default: false 
  },
  foto: {
     type: String 
  }
});

const Miembro = mongoose.model('miembro', miembroSchema);

module.exports = Miembro;
