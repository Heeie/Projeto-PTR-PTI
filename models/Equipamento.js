const mongoose = require('mongoose');

const EquipamentoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  estado: { type: String, enum: ['novo', 'usado', 'avariado'], required: true },
  preco: { type: Number, required: true },
  loja_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Loja' },
  catalogo_id: { type: String, ref: 'CatalogoEquipamentos' },

  imagem: {
    type: String, // URL de imagem
    required: false
  },

  categoria_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
  tipo_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tipo' },

  // NOVO CAMPO: estado de disponibilidade
  estadoDisponibilidade: {
    type: String,
    enum: ['disponivel', 'indisponivel', 'para_analise'],
    default: 'disponivel'
  },

  propostoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilizador', required: false },

  data_registo: { type: Date, default: Date.now }

}, { timestamps: true });

// Impede duplicação por nome + marca + modelo
EquipamentoSchema.index({ nome: 1, marca: 1, modelo: 1 }, { unique: true });

module.exports = mongoose.model('Equipamento', EquipamentoSchema);
