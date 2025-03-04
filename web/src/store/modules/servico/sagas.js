import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import { updateServico, allServicos as allServicosAction, resetServico } from './actions';
import types from './types';
import api from '../../../services/api';
import consts from '../../../consts';

export function* allServicos () {
    console.log('Saga allServicos sendo executada');

    const { form } = yield select(state => state.servico);

    try {
        yield put(updateServico({ form: {...form, filtering:true} }));

        const { data: res } = yield call(
            api.get, 
            `/servico/manicure/${consts.manicureId}`
        );

        yield put(updateServico({ form: {...form, filtering:false} }));

        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(updateServico({ servicos: res.servicos}));

    } catch(err) {
        yield put(updateServico({ form: {...form, filtering:false} }));
        alert(err.message);
    }
}


export function* addServico() {
    const { form, servico, components, behavior } = yield select(state => state.servico);

    try {
        yield put(updateServico({ form: { ...form, saving: true } }));

        // Verificar o valor de servico.duracao
        console.log('Valor de servico.duracao:', servico.duracao);

        // Forçar a conversão para Date
        const duracaoDate = new Date(servico.duracao);

        // Converter a duração para minutos
        const duracaoEmMinutos = duracaoDate.getHours() * 60 + duracaoDate.getMinutes();
        console.log('Duração em minutos (frontend):', duracaoEmMinutos);

        // Validar a duração em minutos
        if (isNaN(duracaoEmMinutos) || duracaoEmMinutos < 0) {
            alert('Duração inválida.');
            yield put(updateServico({ form: { ...form, saving: false } }));
            return;
        }

        // Criar um novo objeto servico com a duração em minutos
        const servicoComDuracaoEmMinutos = { ...servico, duracao: duracaoEmMinutos };

        const formData = new FormData();
        formData.append('servico', JSON.stringify({ ...servicoComDuracaoEmMinutos, manicureId: consts.manicureId }));
        formData.append('manicureId', consts.manicureId);
        servico.arquivos.forEach((a, i) => {
            formData.append(`arquivo_${i}`, a);
        });

        const { data: res } = yield call(
            api[behavior === "create" ? "post" : "put"],
            behavior === "create" ? `/servico` : `/servico/${servico._id}`,
            formData
        );

        yield put(updateServico({ form: { ...form, saving: false } }));

        if (res.error) {
            alert(res.message);
            return false;
        }

        yield put(allServicosAction());
        yield put(updateServico({ components: { ...components, drawer: false } }));
        yield put(resetServico());

    } catch (err) {
        yield put(updateServico({ form: { ...form, saving: false } }));
        alert(err.message);
    }
}

export function* removeServico() {

    const { form, servico, components } = yield select(state => state.servico);

    try {
        yield put(updateServico({ form: {...form, saving:true} }));

        const { data: res } = yield call(
            api.delete, 
            `/servico/${servico._id}`
        );

        yield put(updateServico({ 
            form: {...form, saving:false },
        }));

        if (res.error) {
            alert(res.message);
            return false;
        } 

        yield put(allServicosAction());
        yield put(updateServico({ components: {...components, drawer:false, confirmDelete: false } }));
        yield put(resetServico());


    } catch(err) {
        yield put(updateServico({ form: {...form, saving:false} }));
        alert(err.message);
    }
}

export function* removeArquivo( key ) {
    const { form } = yield select(state => state.servico);

    try {
        yield put(updateServico({ form: {...form, saving:true} }));

        const { data: res } = yield call(api.post, `/servico/delete-arquivo/`, {
            key,
        });

        yield put(updateServico({ 
            form: {...form, saving:false },
        }));

        if (res.error) {
            alert(res.message);
            return false;
        } 


    } catch(err) {
        yield put(updateServico({ form: {...form, saving:false} }));
        alert(err.message);
    }
}

export default all([
    takeLatest(types.ALL_SERVICOS, allServicos),
    takeLatest(types.ADD_SERVICO, addServico),
    takeLatest(types.REMOVE_SERVICO, removeServico),
    takeLatest(types.REMOVE_ARQUIVO, removeArquivo),
]);