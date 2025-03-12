import { combineReducers } from 'redux';

import agendamento from './modules/agendamento/reducer';
import cliente from './modules/cliente/reducer';
import servico from './modules/servico/reducer';
import colaborador from './modules/colaborador/reducer';
import horario from './modules/horario/reducer';
import relatorio from './modules/relatorio/reducer'; // Novo módulo de relatórios

export default combineReducers({
    agendamento,
    cliente,
    colaborador,
    servico,
    horario,
    relatorio, // Adicionando o novo reducer
});
