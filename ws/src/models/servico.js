const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const servico = new Schema({
  manicureId: {
    type: mongoose.Types.ObjectId,
    ref: 'Manicure',
    required:true,
  },
  titulo: {
    type: String,
    required: true,
  },
  preco: {
    type: Number,
    required: true,
  },
  comissao: {
    type: Number,
    required: false,
  },
  duracao: {
    type: Date,
    required: true,
  },
  recorrencia: {
    type: Number,
    required: false,
    default: 30,
  },
  descricao: {
    type: String,
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

module.exports = mongoose.model('Servico', servico);