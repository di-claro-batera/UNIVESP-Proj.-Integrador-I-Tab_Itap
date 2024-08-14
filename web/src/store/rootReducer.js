import { combineReducers } from 'redux'

import agendamento from './modules/agendamento/reducer';
import cliente from './modules/cliente/reducer';
import servico from './modules/servico/reducer';
import colaborador from './modules/colaborador/reducer';
//import horario from './horario/reducer';

export default combineReducers({
    agendamento,
    cliente,
    colaborador,
    servico,
});