// models/CatalogoEquipamentos.js
const mongoose = require('mongoose');

const CatalogoEquipamentosSchema = new mongoose.Schema({
  ean13: {
    type: String,
    required: true,
    unique: true,
    //match: /^\d{13}$/
  },
  marca: { type: String, required: true, index: true },
  modelo: { type: String, required: true, index: true },
  tipo: { type: mongoose.Schema.Types.ObjectId, ref: 'Tipo', required: true },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
  anoLancamento: Number,
  precoLancamento: Number,
  custosPecas: { type: Map, of: Number },  // ex.: { ecrã: 40, bateria: 15 }
  descricao: String
}, { timestamps: true });

CatalogoEquipamentosSchema.index({ marca: 'text', modelo: 'text', descricao: 'text' });

module.exports = mongoose.model('CatalogoEquipamentos', CatalogoEquipamentosSchema);
