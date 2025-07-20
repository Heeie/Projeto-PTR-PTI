const Utilizador = require('../models/Utilizador');
const Equipamento = require("../models/Equipamento");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Transacao = require('../models/Transacao'); // Certifique-se de que o modelo esteja correto

// CRIAR UTILIZADOR
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
      dataNascimento,
      role = 'cliente'
    } = req.body;

    if (!nome || !senha || !email || !nif || !nic || !morada || !genero || !dataNascimento) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    // Verifica se já existe um utilizador com o mesmo email
const emailExistente = await Utilizador.findOne({ email });
if (emailExistente) {
  return res.status(409).json({
    error: 'Já existe um utilizador com este email.'
  });
}

// Verifica se já existe um utilizador com o mesmo NIF
const nifExistente = await Utilizador.findOne({ nif });
if (nifExistente) {
  return res.status(409).json({
    error: 'Já existe um utilizador com este NIF.'
  });
}

// Verifica se já existe um utilizador com o mesmo NIC
const nicExistente = await Utilizador.findOne({ nic });
if (nicExistente) {
  return res.status(409).json({
    error: 'Já existe um utilizador com este NIC.'
  });
}

// Verifica se já existe um utilizador com o mesmo nome
const nomeExistente = await Utilizador.findOne({ nome });
if (nomeExistente) {
  return res.status(409).json({
    error: 'Já existe um utilizador com este nome.'
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
      dataNascimento,
      role
    });

    await novoUtilizador.save();

    res.status(201).json({
      message: "Utilizador criado com sucesso!",
      utilizador: novoUtilizador
    });

  } catch (error) {
    console.error('Erro ao criar utilizador: ', error.message);

    const status = error.message.toLowerCase().includes('obrigatório') ? 400 : 500;

    res.status(status).json({
      error: "Erro ao criar Utilizador",
      detalhes: error.message
    });
  }
};

// PERFIL
exports.getPerfil = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ mensagem: 'Sessão não encontrada ou expirada' });
    }

    const user = await Utilizador.findById(userId).select('-senha');

    if (!user) {
      return res.status(404).json({ mensagem: 'Utilizador não encontrado' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao carregar perfil', detalhes: err.message });
  }
};


exports.alterarSenha = async (req, res) => {
  const userId = req.session.userId;
  const { senhaAntiga, novaSenha } = req.body;

  if (!senhaAntiga || !novaSenha) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  if (novaSenha.length < 6) {
    return res.status(400).json({ erro: 'A nova palavra-passe deve ter no mínimo 6 caracteres.' });
  }

  try {
    const utilizador = await Utilizador.findById(userId);
    if (!utilizador) {
      return res.status(404).json({ erro: 'Utilizador não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(senhaAntiga, utilizador.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Palavra-passe atual incorreta' });
    }

    const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
    utilizador.senha = senhaCriptografada;
    await utilizador.save();

    res.status(200).json({ mensagem: 'Palavra-passe alterada com sucesso' });
  } catch (err) {
    console.error('Erro ao alterar senha:', err);
    res.status(500).json({ erro: 'Erro interno ao alterar palavra-passe' });
  }
};


// FAVORITAR EQUIPAMENTO
exports.favoritarEquipamento = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { equipamentoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(equipamentoId)) {
      return res.status(400).json({ erro: 'ID de equipamento inválido' });
    }

    const user = await Utilizador.findById(userId);
    if (!user) return res.status(404).json({ erro: 'Utilizador não encontrado' });

    const jaFavoritado = user.equipamentosFavoritos?.some(
      id => id.toString() === equipamentoId
    );

    if (!jaFavoritado) {
      await Utilizador.findByIdAndUpdate(
        userId,
        { $addToSet: { equipamentosFavoritos: equipamentoId } },
        { new: true, runValidators: false }
      );
    }

    res.json({ mensagem: 'Equipamento adicionado aos favoritos' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao adicionar favorito' });
  }
};


// REMOVER FAVORITO
exports.removerFavoritoEquipamento = async (req, res) => {
  try {
    const userId = req.session?.userId;

    if (!userId) {
      return res.status(401).json({ erro: 'Sessão de utilizador não encontrada ou expirada.' });
    }

    const { equipamentoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(equipamentoId)) {
      return res.status(400).json({ erro: 'ID de equipamento inválido.' });
    }

    const user = await Utilizador.findById(userId);
    if (!user) {
      return res.status(404).json({ erro: 'Utilizador não encontrado.' });
    }

    const index = user.equipamentosFavoritos.findIndex(
      id => id.toString() === equipamentoId
    );

    if (index === -1) {
      return res.status(404).json({ erro: 'Este equipamento não está nos favoritos.' });
    }

    user.equipamentosFavoritos.splice(index, 1);

    await user.save();

    res.status(200).json({ mensagem: 'Equipamento removido dos favoritos com sucesso.' });
  } catch (err) {
    console.error('Erro ao remover favorito:', err);
    res.status(500).json({ erro: 'Erro ao remover favorito.', detalhes: err.message });
  }
};


// LISTAR FAVORITOS
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

// VERIFICAR FAVORITO
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

    const estaNosFavoritos =
      Array.isArray(utilizador.equipamentosFavoritos) &&
      utilizador.equipamentosFavoritos.some(id => id.toString() === idEquipamento);

    res.status(200).json({
      equipamentoId: idEquipamento,
      favorito: estaNosFavoritos
    });
  } catch (err) {
    console.error('Erro ao verificar favorito:', err);
    res.status(500).json({ error: 'Erro ao verificar favorito' });
  }
};

// LISTAR EQUIPAMENTOS
exports.listarEquipamentos = async (req, res) => {
  try {
    const equipamentos = await Equipamento.find();
    const userId = req.session.userId || req.user?.id;

    let favoritos = [];

    if (userId) {
      const user = await Utilizador.findById(userId).select('equipamentosFavoritos');
      favoritos = user?.equipamentosFavoritos?.map(id => id.toString()) || [];
    }

    const resultado = equipamentos.map(equip => ({
      ...equip.toObject(),
      favorito: favoritos.includes(equip._id.toString())
    }));

    res.json(resultado);
  } catch (err) {
    console.error('Erro ao listar equipamentos:', err);
    res.status(500).json({ erro: 'Erro ao listar equipamentos' });
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

// LISTAR NOTIFICAÇÕES
exports.listarNotificacoes = async (req, res) => {
  try {
    const user = await Utilizador.findById(req.user.id);
    res.status(200).json(user.notificacoes || []);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao carregar notificações', detalhes: err.message });
  }
};
