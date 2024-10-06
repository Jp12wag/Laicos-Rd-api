const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiocesisSchema = new Schema({
    nombre: { type: String, required: true },
    arzobispo: { type: String, required: true },
    parroquias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Parroquia' }]  // Relación con Parroquias
});

module.exports = mongoose.model('Diocesis', DiocesisSchema);

