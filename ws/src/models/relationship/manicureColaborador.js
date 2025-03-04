const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const manicureColaborador = new Schema({
  manicureId: {
    type: mongoose.Types.ObjectId,
    ref: 'Manicure',
    required: true,
  },
  colaboradorId: {
    type: mongoose.Types.ObjectId,
    ref: 'Colaborador',
    required: true,
  },
  status: {
    type: String,
    enum: ['A', 'I', 'E'],
    required: true,
    default: 'A',
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true }); // Adiciona timestamps

manicureColaborador.index({ manicureId: 1, colaboradorId: 1 }); // Índice composto

module.exports = mongoose.model('ManicureColaborador', manicureColaborador);