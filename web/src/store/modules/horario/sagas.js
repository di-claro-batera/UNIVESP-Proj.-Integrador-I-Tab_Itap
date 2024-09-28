import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import { updateHorario, allHorarios as allHorariosAction, resetHorario } from './actions';
import types from './types';
import api from '../../../services/api';
import consts from '../../../consts';

export function* allHorarios () {
    console.log('Saga allHorarios sendo executada');

    const { form } = yield select(state => state.horario);

    try {
        yield put(updateHorario({ form: {...form, filtering:true} }));

        const { data: res } = yield call(
            api.get, 
            `/horario/manicure/${consts.manicureId}`
            );

            yield put(updateHorario({ form: {...form, filtering:false} }));

        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(updateHorario({ horarios: res.horarios}));

    } catch(err) {
        yield put(updateHorario({ form: {...form, filtering:false} }));
        alert(err.message);
    }
}

export function* filterColaboradores() {
    const { form, horario } = yield select(state => state.horario);

    try {
        yield put(updateHorario({ form: {...form, filtering:true} }));
        console.log('Especialidades enviadas:', horario.especialidades);
        const { data: res } = yield call(
            api.post, 
            `/horario/colaboradores`, 
            { especialidades: horario.especialidades }
        );

        console.log('Resposta da API:', res);

        yield put(updateHorario({ form: {...form, filtering:false} }));

        if (res.error) {
            console.log('Erro na resposta:', res.error);
            alert(res.message);
            return false;
        }


        console.log('Lista de Colaboradores:', res.colaboradores);
        yield put(updateHorario({ colaboradores: res.colaboradores }));

    } catch(err) {
        yield put(updateHorario({ form: {...form, filtering:false} }));
        alert(err.message);
    }
}

export function* addHorario() {

    const { form, horario, components, behavior } = yield select(state => state.horario);

    try {
        yield put(updateHorario({ form: {...form, saving:true} }));
        let res = {};

        if (behavior === "create") {
            const response = yield call(api.post, `/horario`, {
                ...horario,
                manicureId: consts.manicureId
            });
            res = response.data;
        } else {
            const response = yield call(api.put, `/horario/${horario._id}`, horario);
            res = response.data;
        }

            yield put(updateHorario({ form: {...form, saving:false} }));

        if (res.error) {
            alert(res.message);
            return false;
        }  
        
        yield put(allHorariosAction());
        yield put(updateHorario({ components: {...components, drawer:false} }));
        yield put(resetHorario());


    } catch(err) {
        yield put(updateHorario({ form: {...form, saving:false} }));
        alert(err.message);
    }
}

export function* removeHorario () {

    const { form, horario, components } = yield select(state => state.horario);

    try {
        yield put(updateHorario({ form: {...form, filtering:true} }));

        const { data: res } = yield call(
            api.delete, 
            `/horario/${horario._id}`
            );

            yield put(updateHorario({ form: {...form, filtering:false} }));

        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(allHorariosAction());
        yield put(
            updateHorario({
                components: { ...components, drawer: false, confirmDelete: false},
            })
        );
        yield put(resetHorario());

    } catch(err) {
        yield put(updateHorario({ form: {...form, filtering:false} }));
        alert(err.message);
    }
}

export function* allServicos() {
    const { form } = yield select(
        (state) => state.horario
    );

    try {
        yield put(updateHorario({ form: {...form, filtering: true}}));
        const { data: res } = yield call(
            api.get,
            `manicure/servicos/${consts.manicureId}`
        );

        yield put(updateHorario({ form: {...form, filtering:false } }));
        if (res.error) {
            alert(res.message);
            return false;
        }

            yield put(updateHorario({ servicos: res.servicos }));

    } catch (err) {
        yield put(updateHorario({ form: {...form, filtering:false} }));
        alert(err.message);
    }
}

export default all([
   takeLatest(types.ALL_HORARIOS, allHorarios),
   takeLatest(types.FILTER_COLABORADORES, filterColaboradores),
   takeLatest(types.ADD_HORARIO, addHorario),
   takeLatest(types.REMOVE_HORARIO, removeHorario),
   takeLatest(types.ALL_SERVICOS, allServicos),
]);