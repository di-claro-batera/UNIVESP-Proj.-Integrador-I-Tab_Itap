import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import moment from 'moment';
import api from '../../../services/api';
import consts from '../../../consts';
import util from '../../../util';
import { updateAgenda, updateManicure, updateServicos, updateColaboradores, updateAgendamento, updateForm } from './actions';
import types from './types';

export function* getManicure() {
    try {
        const { data: res } = yield call(api.get, `/manicure/${consts.manicureId}`);

        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(updateManicure({ ...res.manicure, isOpened: res.manicure.isOpened }));
    } catch (error) {
        alert(error.message);
    }
}

export function* allServicos() {
    try {
        const { data: res } = yield call(api.get, `/servico/manicure/${consts.manicureId}`);

        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(updateServicos(res.servicos));

        // Define o primeiro serviço como padrão
        if (res.servicos.length > 0) {
            yield put(updateAgendamento({
                servicoId: res.servicos[0]._id,
            }));
        }
    } catch (err) {
        alert(err.message);
    }
}

export function* filterAgenda() {
    try {
        const { agendamento } = yield select(state => state.manicure);

        const { data: res } = yield call(api.post, `/agendamento/dias-disponiveis`, {
            ...agendamento,
            data: moment().format('YYYY-MM-DD')
        });

        if (res.error) {
            alert(res.message);
            return false;
        }

        console.log("Dados da API:", res);

        yield put(updateAgenda(res.agenda));
        yield put(updateColaboradores(res.colaboradores));

        // Define o primeiro colaborador como padrão
        if (res.colaboradores.length > 0) {
            yield put(updateAgendamento({
                colaboradorId: res.colaboradores[0]._id,
            }));
        }

        // Define a primeira data disponível como padrão
        if (res.agenda.length > 0) {
            const primeiraDataDisponivel = res.agenda[0]; // Ajuste conforme a estrutura da agenda
            yield put(updateAgendamento({
                data: moment(primeiraDataDisponivel).format(),
            }));
        }

    } catch (err) {
        alert(err.message);
    }
}

export function* saveAgendamento() {
    try {
        yield put(updateForm({ agendamentoLoading: true }));

        const { agendamento } = yield select(state => state.manicure);

        const { data: res } = yield call(api.post, `/agendamento`, agendamento);

        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(updateForm({ agendamentoLoading: false }));
        alert('Agendamento realizado com sucesso!');
    } catch (err) {
        alert(err.message);
    }
}

export default all([
    takeLatest(types.GET_MANICURE, getManicure),
    takeLatest(types.ALL_SERVICOS, allServicos),
    takeLatest(types.FILTER_AGENDA, filterAgenda),
    takeLatest(types.SAVE_AGENDAMENTO, saveAgendamento),
]);