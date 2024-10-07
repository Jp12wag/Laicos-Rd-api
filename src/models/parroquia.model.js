const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParroquiaSchema = new Schema({
    nombre: { type: String, required: true },
    dioesis: { type: Schema.Types.ObjectId, ref: 'Diócesis', required: true }, // Referencia a la diócesis
});

module.exports = mongoose.model('Parroquia', ParroquiaSchema);
