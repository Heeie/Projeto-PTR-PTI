const mongoose = require('mongoose');

const ProjetoBeneficenteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: String,

  organizador_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilizador',
    required: true
  },

  // Lista de doadores
  doadores: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilizador'
  }],

  // Loja associada ao projeto
  loja: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loja'
  },

  // Lista de equipamentos associados ao projeto
  equipamentos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipamento' // Certifique-se de que este model exista
  }],

  // Estado do projeto
  estado: {
    type: String,
    enum: ['ativo', 'finalizado', 'evento futuro'],
    default: 'evento futuro'
  }

}, { timestamps: true });

module.exports = mongoose.model('ProjetoBeneficente', ProjetoBeneficenteSchema);
