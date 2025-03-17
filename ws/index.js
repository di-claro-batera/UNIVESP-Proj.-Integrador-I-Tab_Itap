const express = require('express');
const morgan = require('morgan');
const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');
const cors = require('cors');
require('dotenv').config(); // Carrega as variáveis de ambiente

// Inicializar o Express
const app = express();

// Conectar ao banco de dados
require('./database');

// Middlewares
app.use(morgan('dev')); // Log de requisições
app.use(express.json()); // Parsear JSON no corpo das requisições
app.use(busboy()); // Para upload de arquivos
app.use(busboyBodyParser()); // Parsear multipart/form-data

// Configuração do CORS para permitir múltiplas origens
const allowedOrigins = ['http://localhost:3000', 'http://34.204.0.12:3000'];

// Middleware para lidar com requisições OPTIONS
app.options('*', cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Origem não permitida pelo CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Adicione OPTIONS
    credentials: true,
}));

// Middleware para adicionar headers CORS às respostas
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Rotas
app.use('/manicure', require('./src/routes/manicure.routes'));
app.use('/cliente', require('./src/routes/cliente.routes'));
app.use('/servico', require('./src/routes/servico.routes'));
app.use('/colaborador', require('./src/routes/colaborador.routes'));
app.use('/horario', require('./src/routes/horario.routes'));
app.use('/agendamento', require('./src/routes/agendamento.routes'));
app.use('/relatorios', require('./src/routes/relatorios.routes'));

// Iniciar o servidor
const port = process.env.PORT || 8000; // Usa a porta do .env ou 8000 como fallback
const env = process.env.NODE_ENV || 'development'; // Define o ambiente

app.listen(port, '0.0.0.0', () => {
    console.log(`WS escutando na porta ${port} (${env})`);
});