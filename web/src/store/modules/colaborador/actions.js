import types from './types'

export function allColaboradores() {
    return { type: types.ALL_COLABORADORES };
}

export function updateColaborador(payload) {
    console.log('Ação updateCOLABORADOR sendo disparada', payload);
    return { type: types.UPDATE_COLABORADOR, payload };
}

export function filterColaboradores() {
    return { type:types.FILTER_COLABORADORES };
}

export function addColaborador() {
    return { type:types.ADD_COLABORADOR };
}

export function resetColaborador() {
    return { type:types.RESET_COLABORADOR };
}

export function unlinkColaborador() {
    return { type:types.UNLINK_COLABORADOR };
}

export function allServicos() {
    return { type:types.ALL_SERVICOS };
}

export function colaboradoresDisponiveisAction(payload) {
    return { type: types.COLABORADORES_DISPONIVEIS, payload };
}

export function updateColaboradoresDisponiveis(colaboradores) {
    return {
        type: 'UPDATE_COLABORADORES_DISPONIVEIS', // ou o tipo de ação correto
        payload: colaboradores,
    };
}