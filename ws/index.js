const express = require('express');
const app = express();
const morgan = require('morgan');
const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');
const cors = require('cors');

// DATABASE
require('./database');

//MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
app.use(busboy());
app.use(busboyBodyParser());
app.use(cors());

//VARIABLES
app.set('port', 8000);

/* ROTAS */
app.use('/manicure', require('./src/routes/manicure.routes'));
app.use('/cliente', require('./src/routes/cliente.routes'));
app.use('/servico', require('./src/routes/servico.routes'));
app.use('/colaborador', require('./src/routes/colaborador.routes'));
app.use('/horario', require('./src/routes/horario.routes'));
app.use('/agendamento', require('./src/routes/agendamento.routes'));
app.use('/relatorios', require('./src/routes/relatorios.routes'));


app.listen(app.get('port'), function () {
  console.log('WS escutando porta ' + app.get('port'));
});