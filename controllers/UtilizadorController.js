const Utilizador = require('../models/Utilizador');
const Equipamento = require("../models/Equipamento");
const bcrypt = require('bcrypt'); // ou bcryptjs
const mongoose = require('mongoose');


exports.criarUtilizador = async (req, res) => {
  try {
    console.log('Requisição recebida:', req.body);

    const {
      nome,
      email,
      senha,
      telefone,
      nif,
      nic,
      morada,
      genero,
      role = 'cliente'
    } = req.body;

    if (!nome || !senha || !email) {
      throw new Error('Nome, Email e Senha são obrigatórios.');
    }

      // Verifica se já existe um utilizador com o mesmo email, nif ou nic
    const existente = await Utilizador.findOne({
      $or: [{ email }, { nif }, { nic }]
    });

    if (existente) {
      return res.status(409).json({
        error: 'Já existe um utilizador com este email, NIF ou NIC.'
      });
    }


    const hashedPassword = await bcrypt.hash(senha, 10);

    const novoUtilizador = new Utilizador({
      nome,
      email,
      senha: hashedPassword,
      telefone,
      nif,
      nic,
      morada,
      genero,
      role
    });

    await novoUtilizador.save();

    res.status(201).json({
      message: "Utilizador criado com sucesso!",
      utilizador: novoUtilizador
    });

  } catch (error) {
    console.error('Erro ao criar utilizador: ', error.message);
    res.status(500).json({
      error: "Erro ao criar Utilizador",
      detalhes: error.message
    });
  }
};


exports.getPerfil = async (req, res) => {
  try {
    const userId = req.session.userId; // definido pelo middleware JWT
    const user = await Utilizador.findById(userId).select('-senha');

    if (!user) {
      return res.status(404).json({ mensagem: 'Utilizador não encontrado' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao carregar perfil' });
  }
};

// ADICIONAR EQUIPAMENTO A FAVORITOS
exports.adicionarFavorito = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { equipamentoId } = req.params;

    const user = await Utilizador.findById(userId);
    console.log('User from DB:', user);

    if (!user) return res.status(404).json({ erro: 'Utilizador não encontrado' });

    if (!Array.isArray(user.favoritos)) {
      user.favoritos = [];
    }

    if (!user.favoritos.includes(equipamentoId)) {
      user.favoritos.push(equipamentoId);
      await user.save();
    }

    res.json({ mensagem: 'Equipamento adicionado aos favoritos' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao adicionar favorito' });
  }
};


// ADICIONAR TRANSACAO
exports.adicionarTransacao = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tipo, loja_id, equipamentos, total } = req.body;

    const novaTransacao = new Transacao({
      tipo,
      cliente_id: userId,
      loja_id,
      equipamentos,
      total
    });

    await novaTransacao.save();

    // Adiciona a transação no histórico do utilizador
    const user = await Utilizador.findById(userId);
    user.transacoes.push(novaTransacao._id);
    await user.save();

    res.status(201).json({ mensagem: 'Transação registada', transacao: novaTransacao });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar transação', detalhes: err.message });
  }
};

// LISTAR TRANSACOES
exports.listarTransacoes = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Utilizador.findById(userId).populate({
      path: 'transacoes',
      populate: { path: 'equipamentos loja_id' }
    });

    res.status(200).json(user.transacoes);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar transações', detalhes: err.message });
  }
};

// LISTAR NOTIFICACOES
exports.listarNotificacoes = async (req, res) => {
  try {
    const user = await Utilizador.findById(req.user.id);
    res.status(200).json(user.notificacoes || []);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao carregar notificações', detalhes: err.message });
  }
};

// Adicionar um equipamento aos favoritos
exports.favoritarEquipamento = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { equipamentoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(equipamentoId)) {
      return res.status(400).json({ erro: 'ID de equipamento inválido' });
    }

    const user = await Utilizador.findById(userId);
    if (!user) return res.status(404).json({ erro: 'Utilizador não encontrado' });

    if (!Array.isArray(user.equipamentosFavoritos)) {
      user.equipamentosFavoritos = [];
    }

    if (!user.equipamentosFavoritos.includes(equipamentoId)) {
      user.equipamentosFavoritos.push(equipamentoId);
      await user.save();
    }

    res.json({ mensagem: 'Equipamento adicionado aos favoritos' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao adicionar favorito' });
  }
};



exports.removerFavoritoEquipamento = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { equipamentoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(equipamentoId)) {
      return res.status(400).json({ erro: 'ID de equipamento inválido' });
    }

    const user = await Utilizador.findById(userId);
    if (!user) return res.status(404).json({ erro: 'Utilizador não encontrado' });

    // Garantir que favoritos seja um array
    user.equipamentosFavoritos = user.equipamentosFavoritos || [];

    // Remover o equipamentoId da lista
    user.equipamentosFavoritos = user.equipamentosFavoritos.filter(id => id.toString() !== equipamentoId);

    await user.save();

    res.json({ mensagem: 'Equipamento removido dos favoritos' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao remover favorito' });
  }
};


exports.listarEquipamentos = async (req, res) => {
  try {
    const equipamentos = await Equipamento.find();
    const userId = req.session.userId || req.user?.id;

    let favoritos = [];

    if (userId) {
      const user = await Utilizador.findById(userId).select('equipamentosFavoritos');
      favoritos = user?.equipamentosFavoritos?.map(id => id.toString()) || [];
    }

    const resultado = equipamentos.map(equip => {
      const isFavorito = favoritos.includes(equip._id.toString());
      return {
        ...equip.toObject(),
        favorito: isFavorito
      };
    });

    res.json(resultado);
  } catch (err) {
    console.error('Erro ao listar equipamentos:', err);
    res.status(500).json({ erro: 'Erro ao listar equipamentos' });
  }
};

exports.verificarFavoritoEquipamento = async (req, res) => {
  const userId = req.session.userId;
  const idEquipamento = req.params.idEquipamento;

  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  try {
    const utilizador = await Utilizador.findById(userId);

    if (!utilizador) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    const estaNosFavoritos = Array.isArray(utilizador.equipamentosFavoritos) &&
      utilizador.equipamentosFavoritos.includes(idEquipamento);

    res.status(200).json({
      equipamentoId: idEquipamento,
      favorito: estaNosFavoritos
    });
  } catch (err) {
    console.error('Erro ao verificar favorito:', err);
    res.status(500).json({ error: 'Erro ao verificar favorito' });
  }
};

exports.listarFavoritos = async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await Utilizador.findById(userId).populate('equipamentosFavoritos');
    if (!user) return res.status(404).json({ erro: 'Utilizador não encontrado' });
    res.status(200).json(user.equipamentosFavoritos || []);
  } catch (err) {
    console.error('Erro ao buscar favoritos:', err);
    res.status(500).json({ erro: 'Erro ao buscar favoritos', detalhes: err.message });
  }
};
