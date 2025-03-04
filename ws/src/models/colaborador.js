const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const colaborador = new Schema({
  nome: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: false,
    unique: false,
  },
  senha: {
    type: String,
    default: null,
  },
  foto: String,

  dataNascimento: {
    type: String,
    required: true,
  },
  sexo: {
    type: String,
    enum: ['M', 'F'],
    required: true,
  },
  status: {
    type: String,
    enum: ['A', 'I', 'E'],
    required: true,
    default: 'A',
  },
  contaBancaria: {
    titular: {
      type: String,
      required: false,
    },
    cpfCnpj: {
      type: String,
      required: false,
    },
    banco: {
      type: String,
      required: false,
    },
    tipo: {
      type: String,
      enum: ['conta_corrente', 'conta_poupanca', 'conta_corrente_conjunta', 'conta_poupanca_conjunta'],
      required: false,
    },
    agencia: {
      type: String,
      required: false,
    },
    numero: {
      type: String,
      required: false,
    },
    dv: {
      type: String,
      required: false,
    },
  },
  
  recipientId: {
    type: String,
    required: false,
  },

  especialidades: {
    type: [String], // ou qualquer outro tipo que você espera que as especialidades sejam
    required: false, // ou false, dependendo se cada colaborador deve ter especialidades
  },
  
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Colaborador', colaborador);