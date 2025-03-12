import types from './types';
import { produce } from 'immer';

const INITIAL_STATE = {
    relatorios: {},
};

function relatorio(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.UPDATE_RELATORIOS: {
            console.log('Ação recebida pelo reducer:', action);
            console.log('Atualizando estado com os dados:', action.relatorios);

            return produce(state, (draft) => {
                draft.relatorios = action.relatorios;
            });
        }
        default:
            console.log('Ação ignorada pelo reducer:', action.type);
            return state;
    }
}

export default relatorio;
