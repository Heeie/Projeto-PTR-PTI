const express = require('express');
const router = express.Router();
const AvaliacaoController = require('../controllers/AvaliacaoController');
const { authenticateToken, authorizeRoles } = require('../src/auth');

// Criar avaliação (apenas funcionários ou admins)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('empregado', 'admin'),
  AvaliacaoController.criarAvaliacao
);

// Listar todas as avaliações (admin ou funcionário)
router.get(
  '/',
  authenticateToken,
  authorizeRoles('empregado', 'admin'),
  AvaliacaoController.listarAvaliacoes
);

// Listar avaliações feitas pelo funcionário logado (opcional)
router.get(
  '/minhas',
  authenticateToken,
  authorizeRoles('empregado', 'admin'),
  AvaliacaoController.avaliacoesDoFuncionario
);

module.exports = router;
