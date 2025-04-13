const mongoose = require('mongoose');

const CategoriaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: String
}, { timestamps: true });

module.exports = mongoose.model('Categoria', CategoriaSchema);
