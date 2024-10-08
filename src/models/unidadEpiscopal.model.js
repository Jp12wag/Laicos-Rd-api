const mongoose = require('mongoose')

const unidadEpiscopalSchema = new mongoose.Schema({
  idParroquia: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Parroquia', 
    required: true 
  },
  nombre:      { 
    type: String, 
    required: true 
  }
});  

const UnidadEpiscopal = mongoose.model('unidadEpiscopal', unidadEpiscopalSchema)


module.exports = UnidadEpiscopal