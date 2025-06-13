import mongoose from 'mongoose';

const PecaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  custoSubstituicao: { type: Number, required: true },
});

const AvaliacaoSchema = new mongoose.Schema({
  lojaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loja', required: true },
  empregadoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Empregado', required: true },
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },

  equipamentoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipamento', required: true },
  numeroExemplar: { type: Number, required: true },

  descricaoProblema: { type: String, required: true },
  dataEntrega: { type: Date, required: true, default: Date.now },
  numeroPedidoOrcamento: { type: Number, required: true },

  custoEstimadoReparacao: { type: Number },

  pecasASubstituir: [PecaSchema],  // Array de peças

  estadoEquipamento: { type: String },

  dataOrcamentoFinalizado: { type: Date },

  statusOrcamento: { 
    type: String, 
    enum: ['pendente', 'aprovado', 'rejeitado', 'indisponivel'], 
    default: 'pendente' 
  },

  emailNotificacaoEnviado: { type: Boolean, default: false }
});

export default mongoose.model('Avaliacao', AvaliacaoSchema);
