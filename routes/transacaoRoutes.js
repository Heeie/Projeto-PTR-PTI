const express = require('express');
const Transacao = require('../models/Transacao');
const auth = require('../middlewares/authMiddleware');
const transacaoController = require('../controllers/TransacaoController.js');
const router = express.Router();

// Criar transação
router.post('/', auth, transacaoController.criarTransacao);

// Obter transações do utilizador autenticado
router.get('/', auth, transacaoController.obterTransacoesPorUtilizador);

// Obter todas as transações (talvez admin)
router.get('/todas', auth, transacaoController.obterTodasTransacoes);



module.exports = router;  // exporta só o router
