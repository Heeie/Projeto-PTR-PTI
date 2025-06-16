const mongoose = require('mongoose');

const PecaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  custoSubstituicao: { type: Number, required: true },
});

const EquipamentoAvaliacaoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  marca: { type: String },
  modelo: { type: String },
  tipo: { type: String },
  estado: { type: String }
}, { _id: false });

const AvaliacaoSchema = new mongoose.Schema({
  lojaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loja', required: true },
  empregadoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Empregado', required: true },
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilizador', required: true },
  equipamento: { type: EquipamentoAvaliacaoSchema, required: true },
  numeroExemplar: { type: Number, required: true },
  descricaoProblema: { type: String, required: true },
  dataEntrega: { type: Date, required: true, default: Date.now },
  numeroPedidoOrcamento: { type: Number, required: true },
  custoEstimadoReparacao: { type: Number },
  pecasASubstituir: [PecaSchema],
  estadoEquipamento: { type: String },
  dataOrcamentoFinalizado: { type: Date },
  statusOrcamento: { 
    type: String, 
    enum: ['pendente', 'aprovado', 'rejeitado', 'indisponivel'], 
    default: 'pendente' 
  },
  emailNotificacaoEnviado: { type: Boolean, default: false }
});

module.exports = mongoose.model('Avaliacao', AvaliacaoSchema);
