import types from './types';

export function getManicure() {
    return { type: types.GET_MANICURE };
}

export function updateManicure(manicure) {
    return { type: types.UPDATE_MANICURE, manicure};
}

export function allServicos() {
    return { type: types.ALL_SERVICOS};
}

export function updateServicos(servicos) {
    return { type: types.UPDATE_SERVICOS, servicos};
}

export function updateForm(form) {
    return { type: types.UPDATE_FORM, form};
}

export function updateAgendamento(agendamento) {
    return { type: types.UPDATE_AGENDAMENTO, agendamento};
}

export const saveAgendamentoRequest = () => ({
    type: types.SAVE_AGENDAMENTO,
});

export function updateAgenda(agenda) {
    return { type: types.UPDATE_AGENDA, agenda};
}

export function filterAgenda() {
    return { type: types.FILTER_AGENDA,};
}

export function updateColaboradores(colaboradores) {
    return { type: types.UPDATE_COLABORADORES, colaboradores};
}

export const closeModalAgendamento = () => ({
    type: types.CLOSE_MODAL_AGENDAMENTO,
});

export const buscarClientesRequest = () => ({
    type: types.BUSCAR_CLIENTES_REQUEST,
});

export const buscarClientesSuccess = (clientes) => ({
    type: types.BUSCAR_CLIENTES_SUCCESS,
    payload: clientes,
});

export const buscarClientesFailure = () => ({
    type: types.BUSCAR_CLIENTES_FAILURE,
});

export const handleLoginSuccess = (cliente) => ({
    type: types.LOGIN_SUCCESS,
    payload: cliente,
});