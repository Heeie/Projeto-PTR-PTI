const express = require('express');
const router = express.Router();
const Utilizador = require('../models/Utilizador.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middlewares/authMiddleware');
const utilizadorController = require('../controllers/UtilizadorController');

router.post('/criar', utilizadorController.criarUtilizador);

router.get('/perfil', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Não autenticado (sessão ausente)' });
  }
  try {
    const user = await Utilizador.findById(req.session.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    res.json({
      id: user._id,
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      nif: user.nif,
      nic: user.nic,
      morada: user.morada,
      genero: user.genero,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});


// Rota para buscar utilizadores, podendo filtrar por role
router.get('/utilizadores', async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) {
      filter.role = req.query.role;
    }
    const usuarios = await Utilizador.find(filter);
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


// Login de utilizador
// 🔐 Login de utilizador
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Utilizador.findOne({ nome: username });
    if (!user) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    const senhaCorreta = await bcrypt.compare(password, user.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }
    
    req.session.userId = user._id;
    res.json({
      id: user._id,
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      nif: user.nif,
      nic: user.nic,
      morada: user.morada,
      genero: user.genero,
      role: user.role,
      mensagem: 'Login efetuado com sucesso via sessão'
    });

  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ erro: 'Erro interno no login' });
  }
});


router.post('/session-login', async (req, res) => {
  const { username, password } = req.body;
  const user = await Utilizador.findOne({ nome: username });
  if (!user || !(await bcrypt.compare(password, user.senha))) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }
  // Armazena o ID na sessão
  req.session.userId = user._id;
  res.json({ mensagem: 'Login com sucesso!', user: { nome: user.nome, role: user.role } });
});


// Buscar um utilizador pelo nome
router.get('/utilizadores/nome/:nome', async (req, res) => {
  try {
    const nome = req.params.nome;  // Pega o nome do parâmetro da URL
    const utilizador = await Utilizador.findOne({ nome: nome });  // Busca um utilizador com o nome fornecido
    if (!utilizador) {
      return res.status(404).json({ mensagem: 'Utilizador não encontrado' });
    }
    res.json(utilizador);  // Retorna o utilizador encontrado
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


// Listar todos os utilizadores
router.get('/utilizadores', async (req, res) => {
  try {
    const lista = await Utilizador.find();  // Retorna todos os usuários
    res.json(lista);  // Retorna a lista de usuários
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


router.put('/utilizadores/:id', async (req, res) => {
  try {
    const { nome, email, telefone, nif, nic, morada, genero, role } = req.body;

    // Construir objeto update só com campos permitidos (validados/sanitizados)
    const updateData = {
      nome, email, telefone, nif, nic, morada, genero, role
    };

    // Remove campos undefined ou vazios (opcional)
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    const atualizado = await Utilizador.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!atualizado) return res.status(404).json({ mensagem: 'Utilizador não encontrado' });

    res.json(atualizado);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


// Apagar
router.delete('/utilizadores/:id', async (req, res) => {
  try {
    const apagado = await Utilizador.findByIdAndDelete(req.params.id);
    if (!apagado) return res.status(404).json({ mensagem: 'Utilizador não encontrado' });
    res.json({ mensagem: 'Utilizador removido com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ erro: 'Erro ao sair' });
    res.clearCookie('connect.sid'); // nome padrão do cookie de sessão
    res.json({ mensagem: 'Logout feito com sucesso' });
  });
});


// Recuperar senha - redefine a senha de um utilizador
router.post('/recuperar_senha', async (req, res) => {
  const { username, novaSenha } = req.body;

  try {
    const utilizador = await Utilizador.findOne({ nome: username });

    if (!utilizador) {
      return res.status(404).json({ erro: 'Utilizador não encontrado' });
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);
    utilizador.senha = senhaHash;

    await utilizador.save();

    res.json({ mensagem: 'Senha atualizada com sucesso' });
  } catch (err) {
    console.error('Erro ao recuperar senha:', err);
    res.status(500).json({ erro: 'Erro ao recuperar senha' });
  }
});



// Transações
router.post('/transacoes', utilizadorController.adicionarTransacao);
router.get('/transacoes', utilizadorController.listarTransacoes);

// Notificações
router.get('/notificacoes', utilizadorController.listarNotificacoes);

// Favoritos

// Verificar se um equipamento está nos favoritos do usuário autenticado
router.get('/favorito/:idEquipamento', utilizadorController.verificarFavoritoEquipamento);

router.get('/favoritos', utilizadorController.listarFavoritos);
router.post('/favoritar/:equipamentoId', utilizadorController.favoritarEquipamento);
router.post('/remover-favorito/:equipamentoId', utilizadorController.removerFavoritoEquipamento);


module.exports = router;
