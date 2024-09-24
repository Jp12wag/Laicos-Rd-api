const mongoose = require('mongoose')

const parroquiaSchema = new mongoose.Schema({
  idMiembro: { type: mongoose.Schema.Types.ObjectId, ref: 'Miembro' },
  idClero: { type: mongoose.Schema.Types.ObjectId, ref: 'Clero' },
  idLaico: { type: mongoose.Schema.Types.ObjectId, ref: 'Miembro' },
  nombre: { type: String, required: true },
  telefono: { type: String, required: true },
  email: { type: String, required: true },
  direccion: { type: String, required: true },
  provincia: { type: String, required: true },
  ubicacion: {
    googleMapsLink: { type: String },
    lat: { type: Number },
    lon: { type: Number }
  },
  capacidad: { type: Number, required: true },
  foto: { type: String }
});

const Parroquia = mongoose.model('parroquia', parroquiaSchema)