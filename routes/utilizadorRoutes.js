const express = require('express');
const router = express.Router();
const Utilizador = require('../models/Utilizador.js');
const bcrypt = require('bcryptjs');
const utilizadorController = require('../controllers/UtilizadorController');

// Criar novo utilizador
router.post('/criar', utilizadorController.criarUtilizador);

// Login com sessão regenerada
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Utilizador.findOne({ nome: username });
    if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });

    const match = await bcrypt.compare(password, user.senha);
    if (!match) return res.status(401).json({ erro: 'Senha incorreta' });

    req.session.regenerate(err => {
      if (err) return res.status(500).json({ erro: 'Erro ao iniciar sessão' });

      req.session.userId = user._id;
      req.session.save(err => {
        if (err) return res.status(500).json({ erro: 'Erro ao salvar sessão' });

        res.json({
          id: user._id,
          nome: user.nome,
          email: user.email,
          telefone: user.telefone,
          nif: user.nif,
          nic: user.nic,
          morada: user.morada,
          genero: user.genero,
          role: user.role
        });
      });
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno no login' });
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

// Perfil do utilizador logado
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
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Listar todos
router.get('/', async (req, res) => {
  try {
    const lista = await Utilizador.find();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar
router.put('/:id', async (req, res) => {
  if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) return next();
  try {
    const update = { ...req.body };
    Object.keys(update).forEach(k => update[k] === undefined && delete update[k]);

    const atualizado = await Utilizador.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!atualizado) return res.status(404).json({ mensagem: 'Utilizador não encontrado' });

    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Apagar
router.delete('/:id', async (req, res) => {
  if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) return next();
  try {
    const apagado = await Utilizador.findByIdAndDelete(req.params.id);
    if (!apagado) return res.status(404).json({ mensagem: 'Utilizador não encontrado' });

    res.json({ mensagem: 'Utilizador removido com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Recuperar senha
router.post('/recuperar_senha', async (req, res) => {
  const { username, novaSenha } = req.body;
  try {
    const utilizador = await Utilizador.findOne({ nome: username });
    if (!utilizador) return res.status(404).json({ erro: 'Utilizador não encontrado' });

    utilizador.senha = await bcrypt.hash(novaSenha, 10);
    await utilizador.save();
    res.json({ mensagem: 'Senha atualizada com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao recuperar senha' });
  }
});

// Favoritos, Notificações, Transações
router.post('/transacoes', utilizadorController.adicionarTransacao);
router.get('/transacoes', utilizadorController.listarTransacoes);

router.get('/notificacoes', utilizadorController.listarNotificacoes);

router.get('/favorito/:idEquipamento', utilizadorController.verificarFavoritoEquipamento);
router.get('/favoritos', utilizadorController.listarFavoritos);
router.post('/favoritar/:equipamentoId', utilizadorController.favoritarEquipamento);
router.post('/remover-favorito/:equipamentoId', utilizadorController.removerFavoritoEquipamento);

module.exports = router;
