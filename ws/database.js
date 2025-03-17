const mongoose = require('mongoose');
require('dotenv').config(); // Carrega as variáveis de ambiente do .env

const URI = process.env.DATABASE_URL; // Usa a variável de ambiente

const env = process.env.NODE_ENV || 'development'; // Define o ambiente
let options = {};

// Configurações do Mongoose (opcional)
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);

mongoose
  .connect(URI, options)
  .then(() => console.log('DataBase Rodando!'))
  .catch((err) => console.log(err));