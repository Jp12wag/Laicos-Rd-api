const mongoose = require('mongoose')

const unidadEpiscopalSchema = new Schema({
  idParroquia: { 
    type: Schema.Types.ObjectId, 
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