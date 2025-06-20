const mongoose = require('mongoose');

const EquipamentoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    estado: { type: String, enum: ['novo', 'usado', 'avariado'], required: true },
    preco: { type: Number, required: true },
    loja_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Loja' },
    catalogo_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CatalogoEquipamentos' }
}, { timestamps: true });

module.exports = mongoose.model('Equipamento', EquipamentoSchema);
