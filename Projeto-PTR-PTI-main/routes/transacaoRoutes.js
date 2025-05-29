const express = require('express');
const Transacao = require('../models/Transacao');
const router = express.Router();

// Criar uma nova transação
router.post('/transacoes', async (req, res) => {
    try {
        const novaTransacao = new Transacao(req.body);
        await novaTransacao.save();
        res.status(201).json(novaTransacao);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar todas as transações
router.get('/transacoes', async (req, res) => {
    try {
        const transacoes = await Transacao.find();
        res.json(transacoes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
