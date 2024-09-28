import types from './types'

export function allHorarios() {
    return { type: types.ALL_HORARIOS };
}

export function updateHorario(payload) {
    console.log('Ação updateHORARIO sendo disparada', payload);
    return { type: types.UPDATE_HORARIO, payload };
}

export function filterColaboradores() {
    return { type:types.FILTER_COLABORADORES };
}

export function addHorario() {
    return { type:types.ADD_HORARIO };
}

export function resetHorario() {
    return { type:types.RESET_HORARIO };
}

export function removeHorario() {
    return { type:types.REMOVE_HORARIO };
}

export function allServicos() {
    return { type:types.ALL_SERVICOS };
}