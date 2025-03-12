import types from './types';

export function fetchRelatorios(periodo) {
    return {
        type: types.FETCH_RELATORIOS,
        periodo,
    };
}

export function updateRelatorios(relatorios) {
    return { type: types.UPDATE_RELATORIOS, relatorios };
}
