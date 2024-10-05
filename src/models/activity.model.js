const mongoose = require('mongoose');

const actividadSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  fecha: { type: Date, required: true },
  ubicacion: { type: String, required: true },
  estado: { type: String, enum: ['Pendiente', 'En Curso', 'Finalizado'], default: 'Pendiente' },
  maxParticipantes: { type: Number, default: 0 }, // Si tienes un límite de inscripciones
  inscritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Administradores' }] // Lista de IDs de los inscritos
}, { timestamps: true });

module.exports = mongoose.model('Actividad', actividadSchema);
