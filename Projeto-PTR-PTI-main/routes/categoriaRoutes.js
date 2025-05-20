const express = require('express');
const Categoria = require('../models/Categoria');
const router = express.Router();

// Criar uma nova categoria
router.post('/categorias', async (req, res) => {
    try {
        const novaCategoria = new Categoria(req.body);
        await novaCategoria.save();
        res.status(201).json(novaCategoria);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar todas as categorias
router.get('/categorias', async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
