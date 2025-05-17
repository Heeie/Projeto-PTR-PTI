const express = require('express');
const router = express.Router();
const lojaController = require('../controllers/LojaController');

// Criar uma nova loja usando o controlador
router.post('/lojas', lojaController.criarLoja);

// Listar todas as lojas
router.get('/lojas', async (req, res) => {
    try {
        const lojas = await Loja.find();
        res.json(lojas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
