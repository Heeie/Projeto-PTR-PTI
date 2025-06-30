const express = require('express');
const router = express.Router();
const Equipamento = require('../models/Equipamento.js');
const multer = require('multer');
const path = require('path');  // IMPORTANTE: Adicione isso para usar 'path'
const mongoose = require('mongoose');
const Loja = require('../models/Loja');
const equipamentoController = require('../controllers/equipamento.controller.js');



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
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 5MB para as imagens
  fileFilter: (req, file, cb) => {
    const tiposValidos = ['image/jpeg', 'image/png', 'image/jpg'];
    if (tiposValidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos JPEG, PNG e JPG são permitidos'), false);
    }
  }
});



// Rota que retorna todos equipamentos — deve ficar antes
router.get('/todos', async (req, res) => {
  try {
    const equipamentos = await Equipamento.find({});
    res.json(equipamentos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar equipamentos' });
  }
});

// Rota para buscar equipamento por ID — fica depois
router.get('/:id', async (req, res) => {
  try {
    const equipamento = await Equipamento.findById(req.params.id);
    if (!equipamento) {
      return res.status(404).send('Equipamento não encontrado');
    }
    res.json(equipamento);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro no servidor');
  }
});


router.post('/vender', upload.single('imagem'), equipamentoController.venderEquipamento);



// Busca equipamentos com filtros (ex: /api/equipamentos/search?nome=nokia&marca=samsung)
router.get('/search', async (req, res) => {
    try {
      const filtros = {};

      // Se existir nome
      if (req.query.nome) {
        filtros.nome = new RegExp(req.query.nome, 'i'); // ou $regex
      }

      // Marca e modelo
      if (req.query.marca) filtros.marca = req.query.marca;
      if (req.query.modelo) filtros.modelo = req.query.modelo;

      // 🔧 Adicione esta linha obrigatoriamente
      filtros.estadoDisponibilidade = 'disponivel';
      const equipamentos = await Equipamento.find(filtros);

        if (resultados.length === 0) {
          return res.status(404).json({ message: 'Nenhum equipamento encontrado com esses critérios' });
        }

        res.json(equipamentos);
  } catch (error) {
    console.error('Erro ao buscar equipamentos:', error);
    res.status(500).json({ message: 'Erro ao buscar equipamentos', error: error.message });
  }
});



// Criar um novo equipamento
router.post('/', upload.single('imagem'), async (req, res) => {
  try {
    const { nome, marca, modelo, estado, preco, loja_id, catalogo_id, categoria_id, tipo_id } = req.body;

    if (!nome || !marca || !preco) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
    }

    // Verificação da loja
    const lojaExiste = await Loja.findById(loja_id);
    if (!lojaExiste) {
      return res.status(400).json({ message: 'Loja não encontrada.' });
    }

      // Verifica se equipamento já existe
    const equipamentoExistente = await Equipamento.findOne({ nome, marca, modelo });
    if (equipamentoExistente) {
      return res.status(409).json({ message: 'Equipamento com esse nome, marca e modelo já existe.' });
    }

    // (Opcional) Verifique se os outros relacionamentos também existem
    // const categoriaExiste = await Categoria.findById(categoria_id);
    // const tipoExiste = await Tipo.findById(tipo_id);

    let imagem = null;
    if (req.file) {
     imagem = `/Images/${req.file.filename}`; // correto

    }

    const novoEquipamento = new Equipamento({
      nome,
      marca,
      modelo,
      estado,
      preco,
      loja_id,
      catalogo_id,
      categoria_id,
      tipo_id,
      imagem
    });

    await novoEquipamento.save();
    res.status(201).json(novoEquipamento);
  } catch (error) {
    console.error('Erro ao registrar equipamento:', error);
    res.status(500).json({ message: 'Erro ao registrar equipamento', error: error.message });
  }
});



/*router.get('/equipamentos/:id', async (req, res) => {
  const equipamento = await db.collection('equipamentos').findOne({ _id: new ObjectId(req.params.id) });
  if (!equipamento) return res.status(404).json({ mensagem: "Não encontrado" });
  res.json(equipamento);
});
*/

// /api/equipamentos
router.get('/', async (req, res) => {
  try {
    const equipamentos = await Equipamento.find({ estadoDisponibilidade: 'disponivel' });
    res.json(equipamentos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar equipamentos' });
  }
});


// No seu controller ou rota Express
router.get('/equipamentos', async (req, res) => {
  try {
    const equipamentosDisponiveis = await Equipamento.find({ estadoDisponibilidade: 'disponivel' });
    res.json(equipamentosDisponiveis);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar equipamentos' });
  }
});


// Apagar um equipamento por ID
router.delete('/:id', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
