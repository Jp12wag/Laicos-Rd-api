const mongoose = require('mongoose')


const ArchdioceseSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  arzobispo: { type: String, required: true },
  diocesis: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Diocesis' }]
});
const Arquidocesis = mongoose.model('arquidocesis', ArchdioceseSchema)

 module.exports = Arquidocesis