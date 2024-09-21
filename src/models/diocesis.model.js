const mongoose = require('mongoose');


const diocesisSchema = new mongoose.Schema({
  idUnidadEpiscopal: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'UnidadEpiscopal', 
    required: true 
  },
  nombre: { 
    type: String, 
    required: true
  }
});

const Diocesis = mongoose.model('diocesis', diocesisSchema);

module.exports = Diocesis
