const Transacao = require("../models/Transacao");

exports.criarTransacao = async (req, res) => {
  try {
    const { tipo, cliente_id, loja_id, equipamentos, total } = req.body;

    const novaTransacao = new Transacao({ tipo, cliente_id, loja_id, equipamentos, total });
    await novaTransacao.save();

    res.status(201).json({
      message: "Transação registrada com sucesso!",
      transacao: novaTransacao
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao registrar transação",
      detalhes: error.message
    });
  }
};

exports.obterTodasTransacoes = async (req, res) => {
  try {
    const transacoes = await Transacao.find()
      .populate('cliente_id', 'nome email') // opcional
      .populate('loja_id', 'nome')
      .populate('equipamentos', 'nome marca modelo preco')
      .sort({ createdAt: -1 });

    res.status(200).json(transacoes);
  } catch (error) {
    console.error('Erro ao obter todas as transações:', error);
    res.status(500).json({ error: 'Erro ao obter transações.' });
  }
};

exports.obterTransacoesPorUtilizador = async (req, res) => {
  try {
    const userId = req.user.id;  // definido pelo middleware de autenticação

    const transacoes = await Transacao.find({ cliente_id: userId })
      .populate('loja_id', 'nome')
      .populate('equipamentos', 'nome marca modelo preco')
      .sort({ createdAt: -1 });

    res.status(200).json(transacoes);
  } catch (error) {
    console.error('Erro ao obter transações do utilizador:', error);
    res.status(500).json({ error: 'Erro ao obter histórico de transações.' });
  }
};


