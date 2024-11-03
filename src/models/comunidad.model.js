const mongoose = require('mongoose');

const comunidadSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true,
  },
  administradores: [{
    administrador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    rol: {
      type: String,
      enum: ['admin', 'moderador', 'miembro'],
      default: 'admin' 
    }
  }],
  canales: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Canal'
  }],
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  
  visibilidad: {
    type: String,
    enum: ['publica', 'privada'],
    default: 'publica',
    required: true
  }
}, { timestamps: true });

const Comunidad = mongoose.model('Comunidad', comunidadSchema);

module.exports = Comunidad;
