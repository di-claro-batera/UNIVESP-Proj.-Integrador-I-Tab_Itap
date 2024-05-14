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
});

module.exports = mongoose.model('ManicureColaborador', manicureColaborador);