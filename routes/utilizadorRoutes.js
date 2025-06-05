const express = require('express');
const router = express.Router();
const Utilizador = require('../models/Utilizador.js');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middlewares/authMiddleware');
const utilizadorController = require('../controllers/UtilizadorController');
//const authMiddleware = require('../middlewares/authMiddleware');

// Rota protegida que só usuários autenticados podem acessar
//router.get('/perfil', authMiddleware, utilizadorController.getPerfil);

// Outra rota protegida
//router.post('/atualizar', authMiddleware, utilizadorController.atualizarPerfil);

//module.exports = router;


router.post('/criar', utilizadorController.criarUtilizador);

router.get('/perfil', authMiddleware, utilizadorController.getPerfil);




// Login de utilizador
// 🔐 Login de utilizador
router.post('/login', async (req, res) => {
  console.log('Corpo recebido no login:', req.body);
  const { username, password } = req.body;

  console.log("Tentativa de login:", username);

  try {
    // Buscar usuário pelo email usando o campo 'username' recebido
    const user = await Utilizador.findOne({ email: username });

    if (!user) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(password, user.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user._id, nome: user.nome, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

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
