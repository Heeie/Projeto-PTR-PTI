const Loja = require("../models/Loja");

exports.criarLoja = async (req, res) => {
  try {
    const { nome, endereco, telemovel, email, responsavel_id } = req.body;

    const novaLoja = new Loja({ nome, endereco, telemovel, email, responsavel_id });
    await novaLoja.save();

    res.status(201).json({ message: "Loja criada com sucesso!", loja: novaLoja });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar loja", detalhes: error.message });
  }
};
