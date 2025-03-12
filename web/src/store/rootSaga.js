import { all } from 'redux-saga/effects';

import agendamentoSaga from './modules/agendamento/sagas';
import clienteSaga from './modules/cliente/sagas';
import servicoSaga from './modules/servico/sagas';
import colaboradorSaga from './modules/colaborador/sagas';
import horarioSaga from './modules/horario/sagas';
import relatorioSaga from './modules/relatorio/sagas'; // Novo saga de relatórios

export default function* rootSaga() {
    yield all([
        agendamentoSaga,
        clienteSaga,
        servicoSaga,
        colaboradorSaga,
        horarioSaga,
        relatorioSaga, // Adicionando o novo saga
    ]);
}
