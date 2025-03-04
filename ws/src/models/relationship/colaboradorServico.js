const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const colaboradorServico = new Schema({
  colaboradorId: {
    type: mongoose.Types.ObjectId,
    ref: 'Colaborador',
    required: true,
  },
  servicoId: {
    type: mongoose.Types.ObjectId,
    ref: 'Servico',
    required: true,
  },
  status: {
    type: String,
    enum: ['A', 'I'],
    required: true,
    default: 'A',
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true }); // Adiciona timestamps

colaboradorServico.index({ colaboradorId: 1, servicoId: 1 }); // Índice composto

module.exports = mongoose.model('ColaboradorServico', colaboradorServico);