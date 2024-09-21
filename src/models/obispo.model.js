const mongoose = require('mongoose');

const obispoSchema = new mongoose.Schema({
  idDiocesis:      { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Diocesis', 
    required: true 
  },
  nombre:          { 
    type: String, 
    required: true 
  },
  apellido:        { 
    type: String, 
    required: true 
  },
  email:           { 
    type: String, 
    required: true 
  },
  celular:         { 
    type: String, 
    required: true 
  },
  fechaNacimiento: { 
    type: Date, 
    required: true 
  },
  fechaInicioEnLaIglesia: { 
    type: Date, 
    required: true 
  },
  direccion:       { 
    type: String, 
    required: true 
  },
  cargo:           { 
    type: String, 
    required: true 
  },
  nacionalidad:    { 
    type: String, 
    required: true 
  },
  foto:            { 
    type: String 
  }
});

const Obispo = mongoose.model('obispo', obispoSchema)

module.exports = Obispo