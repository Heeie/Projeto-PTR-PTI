const express = require('express');
const router = express.Router();
const Utilizador = require('../models/Utilizador.js');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middlewares/authMiddleware');
const utilizadorController = require('../controllers/UtilizadorController');
const checkJwt = require('../middlewares/auth0Middleware');

router.post('/criar', utilizadorController.criarUtilizador);

router.get('/perfil', authMiddleware, async (req, res) => {
  try {
    let user;

    // Se for login local (com JWT tradicional)
    if (req.user && req.user.id) {
      user = await Utilizador.findById(req.user.id).select('-senha');
    }

    // Se for login com Auth0
    else if (req.auth && req.auth.sub) {
      const sub = req.auth.sub;
      user = await Utilizador.findOne({ auth0Id: sub });

      // Se não existir, cria
      if (!user) {
        user = new Utilizador({
          nome: req.auth.nickname || req.auth.name,
          email: req.auth.email,
          role: 'cliente',
          auth0Id: sub,
        });
        await user.save();
      }
    }

    if (!user) {
      return res.status(404).json({ mensagem: 'Utilizador não encontrado' });
    }

    res.json({
      id: user._id,
      nome: user.nome,
      email: user.email,
      role: user.role
    });

  } catch (err) {
    console.error("Erro ao obter perfil:", err);
    res.status(500).json({ erro: 'Erro ao carregar perfil' });
  }
});






// Login de utilizador
// 🔐 Login de utilizador
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log("Tentativa de login:", username);

  try {
    const user = await Utilizador.findOne({ nome: username });

    if (!user) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(password, user.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    // ✅ Gerar token JWT
    const token = jwt.sign(
      { id: user._id, nome: user.nome, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 🔐 Retornar token e dados do utilizador (sem a senha)
    res.json({
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ erro: 'Erro interno no login' });
  }
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


// Atualizar
router.put('/utilizadores/:id', async (req, res) => {
  try {
    const atualizado = await Utilizador.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

module.exports = router;
