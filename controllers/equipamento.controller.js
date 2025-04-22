const mongoose = require("mongoose");
const Equipamento = require("../models/Equipamento");

exports.criarEquipamento = async (req, res) => {
  try {
    const { nome, marca, modelo, estado, preco, loja_id, catalogo_id, imagem } = req.body;

    const equipamentoData = {
      nome,
      marca,
      modelo,
      estado,
      preco,
      imagem: imagem || '../public/Images/default.jpg' // Caminho padrão se não for enviado
    };

    // Só adiciona loja_id se for um ObjectId válido
    //if (loja_id && mongoose.Types.ObjectId.isValid(loja_id)) {
    //  equipamentoData.loja_id = loja_id;
    //}

    // Só adiciona catalogo_id se for um ObjectId válido
    //if (catalogo_id && mongoose.Types.ObjectId.isValid(catalogo_id)) {
    //  equipamentoData.catalogo_id = catalogo_id;
    //}

    const novoEquipamento = new Equipamento(equipamentoData);
    await novoEquipamento.save();

    res.status(201).json({ message: "Equipamento registrado com sucesso!", equipamento: novoEquipamento });
  } catch (error) {
    console.error("Erro ao registrar equipamento:", error);
    res.status(500).json({ error: "Erro ao registrar equipamento", detalhes: error.message });
  }
};
