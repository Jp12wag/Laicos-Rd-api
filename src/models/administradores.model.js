const mongoose = require('mongoose')

const administradorSchema = new Schema({
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
  rolUsuario: { 
    type: String, 
    required: true 
  },
  foto: { 
    type: String
  },
  password: {
    type: String, 
    required: true 
  },
  token: { 
    type: String 
  },
  twoFactorSecret: {
    type: String 
  },
  fechaRegistro: { 
    type: Date,
    default: Date.now 
  },
  esMiembro: { 
    type: Boolean,
    default: false 
  }
  })

const  Admin   = mongoose.model('admin', administradorSchema)

module.exports = Admin;