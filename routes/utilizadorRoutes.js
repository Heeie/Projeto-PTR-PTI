const express = require('express');
const router = express.Router();
const Utilizador = require('../models/Utilizador.js');

// Criar utilizador
router.post('/utilizadores', async (req, res) => {
  try {
    const novo = new Utilizador(req.body);
    const salvo = await novo.save();
    res.status(201).json(salvo);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// Listar todos
router.get('/utilizadores', async (req, res) => {
  try {
    const lista = await Utilizador.find();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar
router.put('/utilizadores/:id', async (req, res) => {
  try {
    const atualizado = await Utilizador.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!atualizado) return res.status(404).json({ mensagem: 'Utilizador não encontrado' });
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Apagar
router.delete('/utilizadores/:id', async (req, res) => {
  try {
    const apagado = await Utilizador.findByIdAndDelete(req.params.id);
    if (!apagado) return res.status(404).json({ mensagem: 'Utilizador não encontrado' });
    res.json({ mensagem: 'Utilizador removido com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
