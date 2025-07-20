const express = require('express');
const router = express.Router();
const lojaController = require('../controllers/LojaController');

router.post('/', lojaController.criarLoja);
router.get('/', lojaController.listarLojas);
router.put('/:id', lojaController.atualizarLoja);
router.delete('/:id', lojaController.apagarLoja);

module.exports = router;
