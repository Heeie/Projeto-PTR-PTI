const express = require('express');
const router = express.Router();
const Equipamento = require('../models/Equipamento.js');
const multer = require('multer');
const path = require('path');  // IMPORTANTE: Adicione isso para usar 'path'
const mongoose = require('mongoose');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/Images/'); // Defina o diretório de destino
  },
  filename: (req, file, cb) => {
    // Obtém a extensão do arquivo
    const extname = path.extname(file.originalname);  
    // Usa o nome original do arquivo, mas com um timestamp para evitar sobrescrever
    const filename = `${file.originalname.replace(extname, '')}${extname}`;  // Nome original + timestamp
    cb(null, filename); // Define o nome do arquivo
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB para as imagens
  fileFilter: (req, file, cb) => {
    const tiposValidos = ['image/jpeg', 'image/png', 'image/jpg'];
    if (tiposValidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos JPEG, PNG e JPG são permitidos'), false);
    }
  }
});

// Criar um novo equipamento
router.post('/', upload.single('imagem'), async (req, res) => {
  try {
    console.log('Body recebido:', req.body);
    console.log('Arquivo recebido:', req.file);

    // Verificar se os campos obrigatórios foram fornecidos
    const { nome, marca, modelo, estado, preco, loja_id, catalogo_id } = req.body;
    if (!nome || !marca || !modelo || !estado || !preco || !loja_id || !catalogo_id) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    // Salvar a imagem se o arquivo foi enviado
    let imagem = null;
    if (req.file) {
      imagem = `public/Images/${req.file.filename}`;
    }

    // Criar o novo equipamento
    const novoEquipamento = new Equipamento({
      nome,
      marca,
      modelo,
      estado,
      preco,
      loja_id,  // Usando ObjectId
      catalogo_id,  // Usando ObjectId
      imagem
    });

    // Salvar no banco de dados
    await novoEquipamento.save();
    res.status(201).json(novoEquipamento);
  } catch (error) {
    console.error('Erro ao registrar equipamento:', error);
    res.status(500).json({ message: 'Erro ao registrar equipamento', error: error.message });
  }
});

// Listar todos os equipamentos
router.get('/', async (req, res) => {
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
