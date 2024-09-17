const mongoose = require('mongoose')


const arquidiocesisSchema = new Schema({
  idDiocesis: { 
    type: Schema.Types.ObjectId, 
    ref: 'Diocesis', 
    required: true 
  },
  nombre: { 
    type: String, 
    required: true 
  }
});

const Arquidocesis = mongoose.model('arquidocesis', arquidiocesisSchema)

 module.exports = Arquidocesis