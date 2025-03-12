import { all, takeLatest, call, put } from 'redux-saga/effects';
import api from '../../../services/api';
import types from './types';
import { updateRelatorios } from './actions';
import consts from '../../../consts'


export function* fetchRelatorios({ periodo }) {
    try {
        console.log('Chamando a API com os dados:', {
            manicureId: consts.manicureId,
            periodo,
        });

        const { data: res } = yield call(api.post, 'relatorios/get', {
            manicureId: consts.manicureId,
            periodo,
        });



        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(updateRelatorios(res));
    } catch (err) {

        alert(err.message);
    }
}


export default all([takeLatest(types.FETCH_RELATORIOS, fetchRelatorios)]);
