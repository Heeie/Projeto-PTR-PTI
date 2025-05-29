const express = require('express');
const Tipo = require('../models/Tipo');
const router = express.Router();

// Criar um novo tipo
router.post('/tipos', async (req, res) => {
    try {
        const novoTipo = new Tipo(req.body);
        await novoTipo.save();
        res.status(201).json(novoTipo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar todos os tipos
router.get('/tipos', async (req, res) => {
    try {
        const tipos = await Tipo.find();
        res.json(tipos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
