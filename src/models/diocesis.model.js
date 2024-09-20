const mongoose = require('mongoose');


const diocesisSchema = new Schema({
  idUnidadEpiscopal: { 
    type: Schema.Types.ObjectId, 
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
