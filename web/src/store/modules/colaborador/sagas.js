import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import { updateColaborador, allColaboradores as allColaboradoresAction, resetColaborador } from './actions';
import types from './types';
import api from '../../../services/api';
import consts from '../../../consts';

export function* allColaboradores() {
    console.log('Saga allColaboradores sendo executada');

    const { form } = yield select(state => state.colaborador);

    try {
        yield put(updateColaborador({ form: { ...form, filtering: true } }));

        const { data: res } = yield call(
            api.get,
            `/colaborador/manicure/${consts.manicureId}`
        );

        yield put(updateColaborador({ form: { ...form, filtering: false } }));

        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(updateColaborador({ colaboradores: res.colaboradores }));

    } catch (err) {
        yield put(updateColaborador({ form: { ...form, filtering: false } }));
        alert(err.message);
    }
}

export function* filterColaboradores() {

    const { form, colaborador } = yield select(state => state.colaborador);

    try {
        yield put(updateColaborador({ form: { ...form, filtering: true } }));

        const { data: res } = yield call(api.post, `/colaborador/filter`, {
            filters: {
                email: colaborador.email,
                status: 'A',
                sexo: colaborador.sexo
            },
        });

        yield put(updateColaborador({ form: { ...form, filtering: false } }));

        if (res.error) {
            alert(res.message);
            return false;
        }

        if (res.colaboradores.length > 0) {
            yield put(updateColaborador({
                colaborador: res.colaboradores[0],
                form: { ...form, filtering: false, disabled: true }
            }));
        } else {
            yield put(updateColaborador({ form: { ...form, disabled: false } }));
        }

    } catch (err) {
        yield put(updateColaborador({ form: { ...form, filtering: false } }));
        alert(err.message);
    }
}

export function* addColaboradores() {

    const { form, colaborador, components, behavior } = yield select(state => state.colaborador);

    try {
        yield put(updateColaborador({ form: { ...form, saving: true } }));
        let res = {};

        // Extrai os IDs das especialidades
        const especialidadesIds = colaborador.especialidades.map(especialidade => especialidade.value);

        if (behavior === "create") {
            const response = yield call(api.post, `/colaborador`, {
                manicureId: consts.manicureId,
                colaborador: {
                    ...colaborador,
                    especialidades: especialidadesIds, // Envia apenas os IDs
                }
            });
            res = response.data;
        } else {
            const response = yield call(api.put, `/colaborador/${colaborador._id}`, {
                vinculo: colaborador.vinculo,
                vinculoId: colaborador.vinculoId,
                especialidades: especialidadesIds, // Envia apenas os IDs
            });
            res = response.data;
        }

        yield put(updateColaborador({ form: { ...form, saving: false } }));

        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(allColaboradoresAction());
        yield put(updateColaborador({ components: { ...components, drawer: false } }));
        yield put(resetColaborador());


    } catch (err) {
        yield put(updateColaborador({ form: { ...form, saving: false } }));
        alert(err.message);
    }
}

export function* unlinkColaborador() {

    const { form, colaborador, components } = yield select(state => state.colaborador);

    try {
        yield put(updateColaborador({ form: { ...form, saving: true } }));

        const { data: res } = yield call(api.delete,
            `/colaborador/vinculo/${colaborador.vinculoId}`
        );

        yield put(updateColaborador({
            form: { ...form, saving: false },
        })
        );

        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(allColaboradoresAction());
        yield put(updateColaborador({ components: { ...components, drawer: false, confirmDelete: false } }));
        yield put(resetColaborador());


    } catch (err) {
        yield put(updateColaborador({ form: { ...form, saving: false } }));
        alert(err.message);
    }
}

export function* allServicos() {
    const { form } = yield select(
        (state) => state.colaborador
    );

    try {
        yield put(updateColaborador({ form: { ...form, filtering: true } }));
        const { data: res } = yield call(
            api.get,
            `manicure/servicos/${consts.manicureId}`
        );

        yield put(updateColaborador({ form: { ...form, filtering: false } }));
        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(updateColaborador({ servicos: res.servicos }));

    } catch (err) {
        yield put(updateColaborador({ form: { ...form, filtering: false } }));
        alert(err.message);
    }
}

export function* colaboradoresDisponiveis(action) {
    const { especialidades } = action.payload;
    try {
        const { data: res } = yield call(api.post, `/horario/colaboradores`, { // Corrigir a rota
            especialidades,
            manicureId: consts.manicureId,
        });
        if (res.error) {
            alert(res.message);
            return false;
        }
        yield put(updateColaborador({ colaboradoresDisponiveis: res.colaboradores }));
    } catch (err) {
        alert(err.message);
    }
}

export default all([
    takeLatest(types.ALL_COLABORADORES, allColaboradores),
    takeLatest(types.FILTER_COLABORADORES, filterColaboradores),
    takeLatest(types.ADD_COLABORADOR, addColaboradores),
    takeLatest(types.UNLINK_COLABORADOR, unlinkColaborador),
    takeLatest(types.ALL_SERVICOS, allServicos),
    takeLatest(types.COLABORADORES_DISPONIVEIS, colaboradoresDisponiveis),
]);