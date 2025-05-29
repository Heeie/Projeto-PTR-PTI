const Categoria = require("../models/Categoria");

exports.criarCategoria = async (req, res) => {
  try {
    const { nome, descricao } = req.body;

    const novaCategoria = new Categoria({ nome, descricao });
    await novaCategoria.save();

    res.status(201).json({ message: "Categoria criada com sucesso!", categoria: novaCategoria });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar categoria", detalhes: error.message });
  }
};
