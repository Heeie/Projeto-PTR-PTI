const express = require('express');
const router = express.Router();
const equipamentoController = require('../controllers/equipamento.controller');
const Equipamento = require('../models/Equipamento.js'); // 👈 este era o que estava a faltar

// Criar um novo equipamento
router.post('/equipamentos', equipamentoController.criarEquipamento);

// Listar todos os equipamentos
router.get('/equipamentos', async (req, res) => {
    try {
        const equipamentos = await Equipamento.find();
        res.json(equipamentos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Apagar um equipamento por ID
router.delete('/equipamentos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await Equipamento.findByIdAndDelete(id);
        
        if (!resultado) {
            return res.status(404).json({ mensagem: 'Equipamento não encontrado' });
        }

        res.json({ mensagem: 'Equipamento removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});
// Atualizar um equipamento por ID
router.put('/equipamentos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const atualizacoes = req.body;

        const equipamentoAtualizado = await Equipamento.findByIdAndUpdate(id, atualizacoes, { new: true });

        if (!equipamentoAtualizado) {
            return res.status(404).json({ mensagem: 'Equipamento não encontrado' });
        }

        res.json(equipamentoAtualizado);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

module.exports = router;
