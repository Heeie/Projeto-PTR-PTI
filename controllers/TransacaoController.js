const Transacao = require("../models/Transacao");

exports.criarTransacao = async (req, res) => {
 console.log('🔍 Sessão ativa:', req.session);
  console.log('🔍 Utilizador autenticado:', req.user);

  try {
    const {
      tipo = 'compra',
      loja_id,
      equipamentos,
      total,
      canal,
      vendedor_id
    } = req.body;

    // Usa req.user.id conforme definido no middleware de autenticação
    const transacao = await Transacao.create({
      tipo,
      cliente_id: req.user.id,
      loja_id,
      equipamentos,
      total,
      canal,
      vendedor_id
    });

    await transacao.populate('equipamentos');
    await transacao.populate('loja_id');
    await transacao.populate('vendedor_id');

    // 🔽 Marcar equipamentos como indisponíveis após compra
    const Equipamento = require('../models/Equipamento');
    await Equipamento.updateMany(
      { _id: { $in: equipamentos } },
      { $set: { estadoDisponibilidade: 'indisponivel' } }
    );

    res.status(201).json({
      message: 'Transação criada com sucesso',
      transacao
    });
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: 'Erro ao criar transação' });
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
    const userId = req.user.id;  // também compatível com o middleware

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
