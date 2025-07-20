const express = require('express');
const Transacao = require('../models/Transacao');
const transacaoController = require('../controllers/TransacaoController.js');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Criar transação
router.post('/', authMiddleware, transacaoController.criarTransacao);

// Obter transações do utilizador autenticado
router.get('/', authMiddleware, transacaoController.obterTransacoesPorUtilizador);

// Obter todas as transações (talvez admin)
router.get('/todas', authMiddleware, transacaoController.obterTodasTransacoes);



module.exports = router;  // exporta só o router
