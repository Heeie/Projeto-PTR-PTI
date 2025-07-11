const express = require('express');
const router = express.Router();
const Utilizador = require('../models/Utilizador.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middlewares/authMiddleware');
const utilizadorController = require('../controllers/UtilizadorController');

// Criar utilizador
router.post('/criar', utilizadorController.criarUtilizador);

// Perfil do utilizador autenticado
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

// Buscar utilizadores por role
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

// 🔐 Login de utilizador com sessão regenerada e salva corretamente
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

    req.session.regenerate(err => {
      if (err) {
        console.error('Erro ao regenerar sessão:', err);
        return res.status(500).json({ erro: 'Erro ao iniciar sessão' });
      }

      req.session.userId = user._id;

      req.session.save(err => {
        if (err) {
          console.error('Erro ao salvar sessão:', err);
          return res.status(500).json({ erro: 'Erro ao salvar sessão' });
        }

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
      });
    });

  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ erro: 'Erro interno no login' });
  }
});

// Login alternativo (opcional)
router.post('/session-login', async (req, res) => {
  const { username, password } = req.body;
  const user = await Utilizador.findOne({ nome: username });
  if (!user || !(await bcrypt.compare(password, user.senha))) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }

  req.session.userId = user._id;
  res.json({ mensagem: 'Login com sucesso!', user: { nome: user.nome, role: user.role } });
});

// Buscar utilizador por nome
router.get('/utilizadores/nome/:nome', async (req, res) => {
  try {
    const nome = req.params.nome;
    const utilizador = await Utilizador.findOne({ nome });
    if (!utilizador) {
      return res.status(404).json({ mensagem: 'Utilizador não encontrado' });
    }
    res.json(utilizador);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Listar todos os utilizadores
router.get('/utilizadores', async (req, res) => {
  try {
    const lista = await Utilizador.find();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar utilizador
router.put('/utilizadores/:id', async (req, res) => {
  try {
    const { nome, email, telefone, nif, nic, morada, genero, role } = req.body;
    const updateData = { nome, email, telefone, nif, nic, morada, genero, role };
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

// Apagar utilizador
router.delete('/utilizadores/:id', async (req, res) => {
  try {
    const apagado = await Utilizador.findByIdAndDelete(req.params.id);
    if (!apagado) return res.status(404).json({ mensagem: 'Utilizador não encontrado' });
    res.json({ mensagem: 'Utilizador removido com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ erro: 'Erro ao sair' });
    res.clearCookie('connect.sid');
    res.json({ mensagem: 'Logout feito com sucesso' });
  });
});

// Recuperar senha
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
router.get('/favorito/:idEquipamento', utilizadorController.verificarFavoritoEquipamento);
router.get('/favoritos', utilizadorController.listarFavoritos);
router.post('/favoritar/:equipamentoId', utilizadorController.favoritarEquipamento);
router.post('/remover-favorito/:equipamentoId', utilizadorController.removerFavoritoEquipamento);

module.exports = router;
