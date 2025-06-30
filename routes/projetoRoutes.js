const express = require('express');
//const ProjetoBeneficente = require('../models/ProjetoBeneficente');
const router = express.Router();

const projetoController = require('../controllers/ProjetoBeneficenteController');

router.post('/cria-projeto', projetoController.criarProjeto);
router.get('/projetos', projetoController.listarProjetos);
router.put('/projetos/:id', projetoController.editarProjeto);
router.delete('/projetos/:id', projetoController.apagarProjeto);

module.exports = router;
