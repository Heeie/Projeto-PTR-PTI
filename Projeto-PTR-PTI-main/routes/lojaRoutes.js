const express = require('express');
const Loja = require('../models/Loja');
const router = express.Router();

// Criar uma nova loja
router.post('/lojas', async (req, res) => {
    try {
        const novaLoja = new Loja(req.body);
        await novaLoja.save();
        res.status(201).json(novaLoja);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

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
