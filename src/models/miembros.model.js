const mongoose = require('mongoose');

const miembroSchema = new Schema({
  idParroquia: { 
    type: Schema.Types.ObjectId,
    ref: 'Parroquia',
    required: true 
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

const Miembros = mongoose.model('miembro', miembroSchema);

module.exports = Miembros;