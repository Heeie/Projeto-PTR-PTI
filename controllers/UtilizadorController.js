const Utilizador = require('../models/Utilizador');
const bcrypt = require('bcrypt'); // ou bcryptjs

exports.criarUtilizador = async (req, res) => {
  try {
    console.log('Requisição recebida:', req.body);

    const {
      nome,
      email,
      senha,
      telefone,
      nif,
      nic,
      morada,
      genero,
      role = 'cliente'
    } = req.body;

    if (!nome || !senha || !email) {
      throw new Error('Nome, Email e Senha são obrigatórios.');
    }

      // Verifica se já existe um utilizador com o mesmo email, nif ou nic
    const existente = await Utilizador.findOne({
      $or: [{ email }, { nif }, { nic }]
    });

    if (existente) {
      return res.status(409).json({
        error: 'Já existe um utilizador com este email, NIF ou NIC.'
      });
    }


    const hashedPassword = await bcrypt.hash(senha, 10);

    const novoUtilizador = new Utilizador({
      nome,
      email,
      senha: hashedPassword,
      telefone,
      nif,
      nic,
      morada,
      genero,
      role
    });

    await novoUtilizador.save();

    res.status(201).json({
      message: "Utilizador criado com sucesso!",
      utilizador: novoUtilizador
    });

  } catch (error) {
    console.error('Erro ao criar utilizador: ', error.message);
    res.status(500).json({
      error: "Erro ao criar Utilizador",
      detalhes: error.message
    });
  }
};


exports.getPerfil = async (req, res) => {
  try {
    const userId = req.user.id; // definido pelo middleware JWT
    const user = await Utilizador.findById(userId).select('-senha');

    if (!user) {
      return res.status(404).json({ mensagem: 'Utilizador não encontrado' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao carregar perfil' });
  }
};




