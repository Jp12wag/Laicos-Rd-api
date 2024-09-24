const mongoose = require('mongoose')


const arquidiocesisSchema = new mongoose.Schema({
  idDiocesis: { 
    type: mongoose.Schema.Types.ObjectId, 
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