const mongoose = require('mongoose');

const UtilizadorSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  telefone: {
    type: String,
    validate: {
      validator: v => /^\d{9}$/.test(v),
      message: props => `${props.value} não é um número de telefone válido.`
    }
  },
  nif: {
    type: String,
    required: true,
    validate: {
      validator: v => /^\d{9}$/.test(v),
      message: props => `${props.value} não é um NIF válido.`
    }
  },
  nic: { type: String, required: true },
  morada: { type: String, required: true },
  genero: { type: String, enum: ['Masculino', 'Feminino', 'Outro'], required: true },
  dataNascimento: { type: Date, required: true },

  role: {
    type: String,
    enum: ['cliente', 'empregado', 'organizador', 'doador', 'admin'],
    default: 'cliente'
  },

  notificacoes: [
    {
      mensagem: { type: String, required: true },
      data: { type: Date, default: Date.now }
    }
  ],

  equipamentosFavoritos: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipamento' }],
    default: []
  },

  transacoes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transacao'
    }
  ]

}, {
  timestamps: true
});

// Verifica se o utilizador tem 16 ou mais anos
UtilizadorSchema.pre('save', function (next) {
  if (!this.dataNascimento) return next(new Error('Data de nascimento é obrigatória.'));

  const hoje = new Date();
  const nascimento = new Date(this.dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();

  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  if (idade < 16) {
    return next(new Error('O utilizador deve ter pelo menos 16 anos.'));
  }

  next();
});

module.exports = mongoose.model('Utilizador', UtilizadorSchema);
