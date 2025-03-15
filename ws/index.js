const express = require('express');
const morgan = require('morgan');
const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');
const cors = require('cors');

// Inicializar o Express
const app = express();

// Conectar ao banco de dados
require('./database');

// Middlewares
app.use(morgan('dev')); // Log de requisições
app.use(express.json()); // Parsear JSON no corpo das requisições
app.use(busboy()); // Para upload de arquivos
app.use(busboyBodyParser()); // Parsear multipart/form-data
app.use(cors({
    origin: 'http://34.204.0.12:3000', // Permitir apenas o frontend (IP da instância EC2)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    credentials: true, // Permitir cookies e autenticação
}));

// Variáveis
const port = 8000; // Porta fixa
const env = 'production'; // Ambiente fixo (produção)

// Rotas
app.use('/manicure', require('./src/routes/manicure.routes'));
app.use('/cliente', require('./src/routes/cliente.routes'));
app.use('/servico', require('./src/routes/servico.routes'));
app.use('/colaborador', require('./src/routes/colaborador.routes'));
app.use('/horario', require('./src/routes/horario.routes'));
app.use('/agendamento', require('./src/routes/agendamento.routes'));
app.use('/relatorios', require('./src/routes/relatorios.routes'));

// Iniciar o servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`WS escutando na porta ${port} (${env})`);
});
