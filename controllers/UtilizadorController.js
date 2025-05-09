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

    if (!nome || !senha) {
      throw new Error('Nome e Senha são obrigatórios.');
    }

    // ➤ Criptografar a senha ANTES de salvar
    const hashedPassword = await bcrypt.hash(senha, 10); // 10 = saltRounds

    const novoUtilizador = new Utilizador({
      nome,
      email,
      senha: hashedPassword, // senha criptografada aqui
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
