const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiócesisSchema = new Schema({
    nombre: { type: String, required: true },
    parroquias: [{ type: Schema.Types.ObjectId, ref: 'Parroquia' }] // Relación con Parroquias
});

module.exports = mongoose.model('Diócesis', DiócesisSchema);
