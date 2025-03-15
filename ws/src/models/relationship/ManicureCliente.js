const mongoose = require('mongoose');
const Schema = mongoose.Schema;

console.log('Arquivo ManicureCliente.js carregado com sucesso!');

const manicureClienteSchema = new Schema({
  manicureId: {
    type: mongoose.Types.ObjectId,
    ref: 'Manicure',
    required: true,
  },
  clienteId: {
    type: mongoose.Types.ObjectId,
    ref: 'Cliente',
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

manicureClienteSchema.index({ manicureId: 1, clienteId: 1 }); // Índice composto

module.exports = mongoose.model('ManicureCliente', manicureClienteSchema);
