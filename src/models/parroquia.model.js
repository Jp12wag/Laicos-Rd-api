const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParroquiaSchema = new Schema({
    nombre: { type: String, required: true },
    sacerdote: { type: String, required: true },
    diocesis: { type: mongoose.Schema.Types.ObjectId,
         ref: 'Diocesis', 
         required: false, 
         default:'' },  // Relación con Diócesis
    clero: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clero' }]  // Relación con Clero
});

module.exports = mongoose.model('Parroquia', ParroquiaSchema);
