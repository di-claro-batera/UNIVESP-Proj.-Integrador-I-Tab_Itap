const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const horario = new Schema({
  manicureId: {
    type: mongoose.Types.ObjectId,
    ref: 'Manicure',
    required: true,
  },
  dias: {
    type: [Number],
    required: true,
  },
  inicio: {
    type: Date,
    required: true,
  },
  fim: {
    type: Date,
    required: true,
  },
  especialidades: {
    type: [{ type: mongoose.Types.ObjectId, ref: 'Servico' }],
    required: true,
  },
  colaboradores: {
    type: [{ type: mongoose.Types.ObjectId, ref: 'Colaborador' }],
    required: true,
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Horario', horario);