const express = require('express');
const router = express.Router();
const Utilizador = require('../models/Utilizador.js');
const bcrypt = require('bcryptjs');
const utilizadorController = require('../controllers/UtilizadorController');

<<<<<<< Updated upstream
// Criar novo utilizador
=======
// Criar utilizador
>>>>>>> Stashed changes
router.post('/criar', utilizadorController.criarUtilizador);
router.put('/alterarSenha', authMiddleware, utilizadorController.alterarSenha);

<<<<<<< Updated upstream
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
  try {
    const update = { ...req.body };
    Object.keys(update).forEach(k => update[k] === undefined && delete update[k]);
=======
// Login (via sessão)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Utilizador.findOne({ nome: username });
    if (!user || !(await bcrypt.compare(password, user.senha))) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
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

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ erro: 'Erro ao sair' });
    res.clearCookie('connect.sid');
    res.json({ mensagem: 'Logout feito com sucesso' });
  });
});

// Recuperação de senha
router.post('/recuperar_senha', async (req, res) => {
  const { username, novaSenha } = req.body;
  try {
    const utilizador = await Utilizador.findOne({ nome: username });
    if (!utilizador) return res.status(404).json({ erro: 'Utilizador não encontrado' });

    const senhaHash = await bcrypt.hash(novaSenha, 10);
    utilizador.senha = senhaHash;
    await utilizador.save();

    res.json({ mensagem: 'Senha atualizada com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao recuperar senha' });
  }
});

// Perfil do utilizador autenticado
router.get('/perfil', authMiddleware, async (req, res) => {
  try {
    const user = await Utilizador.findById(req.session.userId).select('-senha');
    if (!user) return res.status(404).json({ erro: 'Utilizador não encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao carregar perfil' });
  }
});

// Buscar todos os utilizadores (com filtro por role opcional)
router.get('/utilizadores', async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    const utilizadores = await Utilizador.find(filter);
    res.json(utilizadores);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Buscar utilizador por nome
router.get('/utilizadores/nome/:nome', async (req, res) => {
  try {
    const utilizador = await Utilizador.findOne({ nome: req.params.nome });
    if (!utilizador) return res.status(404).json({ mensagem: 'Utilizador não encontrado' });
    res.json(utilizador);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar utilizador
router.put('/utilizadores/:id', async (req, res) => {
  try {
    const camposPermitidos = ['nome', 'email', 'telefone', 'nif', 'nic', 'morada', 'genero', 'role', 'dataNascimento'];

    const updateData = {};

    camposPermitidos.forEach(campo => {
      if (req.body[campo] !== undefined) updateData[campo] = req.body[campo];
    });

    const atualizado = await Utilizador.findByIdAndUpdate(req.params.id, updateData, { new: true });
>>>>>>> Stashed changes

    const atualizado = await Utilizador.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!atualizado) return res.status(404).json({ mensagem: 'Utilizador não encontrado' });

    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

<<<<<<< Updated upstream
// Apagar
router.delete('/:id', async (req, res) => {
=======
// Apagar utilizador
router.delete('/utilizadores/:id', async (req, res) => {
>>>>>>> Stashed changes
  try {
    const apagado = await Utilizador.findByIdAndDelete(req.params.id);
    if (!apagado) return res.status(404).json({ mensagem: 'Utilizador não encontrado' });

    res.json({ mensagem: 'Utilizador removido com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

<<<<<<< Updated upstream
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
=======
// Transações
router.post('/transacoes', authMiddleware, utilizadorController.adicionarTransacao);
router.get('/transacoes', authMiddleware, utilizadorController.listarTransacoes);

// Notificações
router.get('/notificacoes', authMiddleware, utilizadorController.listarNotificacoes);

// Favoritos
router.get('/favoritos', authMiddleware, utilizadorController.listarFavoritos);
router.get('/favorito/:idEquipamento', authMiddleware, utilizadorController.verificarFavoritoEquipamento);
router.post('/favoritar/:equipamentoId', authMiddleware, utilizadorController.favoritarEquipamento);
router.post('/remover-favorito/:equipamentoId', authMiddleware, utilizadorController.removerFavoritoEquipamento);
>>>>>>> Stashed changes

module.exports = router;
