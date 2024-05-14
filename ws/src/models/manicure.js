const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const manicure = new Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório.']
  },
  foto: String,
  capa: String,
  email: {
    type: String,
    required: [true, 'E-mail é obrigatório.']
  },
  senha: {
    type: String,
    default: null,
  },
  telefone: String,
  recipientId: String,
  endereco: {
    cidade: String,
    uf: String,
    cep: String,
    logradouro: String,
    numero: String,
    pais: String,
  },
  //geo: {
  //  type: String,
  //  coordinates: [Number],
  //},
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
});

//manicure.index({ geo: '2dsphere' });

module.exports = mongoose.model('Manicure', manicure);