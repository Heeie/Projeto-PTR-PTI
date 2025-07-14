const express = require('express');
const router = express.Router();
const lojaController = require('../controllers/LojaController');

// Criar uma nova loja usando o controlador
router.post('/', lojaController.criarLoja);


// Listar todas as lojas
router.get('/', lojaController.listarLojas);

// Atualizar loja
router.put('/:id', lojaController.atualizarLoja);

// Deletar loja
router.delete('/:id', lojaController.apagarLoja);


module.exports = router;
