import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import moment from 'moment';
import api from '../../../services/api';
import consts from '../../../consts';
import { updateManicure, updateServicos } from './actions';
import types from './types';


export function* getManicure() {
    try {
        const { data: res } = yield call(api.get, `/manicure/${consts.manicureId}`);

        if (res.error) {
            alert(err.message);
            return false;
        }

        yield put(updateManicure(res.manicure));
    } catch(err) {
        alert(err.message); 
    }
}

export function* allServicos() {
    try {
        const { data: res } = yield call(api.get, `/servico/manicure/${consts.manicureId}`);

        if (res.error) {
            alert(err.message);
            return false;
        }

        yield put(updateServicos(res.servicos));
    } catch(err) {
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
            alert(err.message);
            return false;
        }
    } catch(err) {
        alert(err.message); 
    }
}

export default all ([
    takeLatest(types.GET_MANICURE, getManicure),
    takeLatest(types.ALL_SERVICOS, allServicos),
    takeLatest(types.FILTER_AGENDA, filterAgenda),

]);