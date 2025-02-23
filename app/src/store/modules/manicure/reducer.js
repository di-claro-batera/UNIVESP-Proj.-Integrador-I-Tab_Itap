import types from './types';
import { produce } from 'immer';
import consts from '../../../consts';

const INITIAL_STATE = {
    manicure: {},
    servicos: [],
    agenda: [],
    colaboradores: [],
    agendamento: {
        clienteId: consts.clienteId,
        manicureId: consts.manicureId,
        servicoId: null,
        colaboradorId: null,
        data: null,
    },
    form: {
        inputFiltro: '',
        inputFiltroFoco: false,
        modalEspecialista: false,
        modalAgendamento: 0,
        agendamentoLoading: false,
    },
};

function manicure(state = INITIAL_STATE, action) {
    switch (action.type) {

        case types.UPDATE_MANICURE: {
            return produce(state, draft => {
                draft.manicure = { ...draft.manicure, ...action.manicure};
            });
        }

        case types.UPDATE_SERVICOS: {
            return produce(state, draft => {
                draft.servicos = action.servicos;
            });
        }

        case types.UPDATE_FORM: {
            return produce(state, draft => {
                draft.form = { ...state.form, ... action.form};
            });
        }

        case types.UPDATE_AGENDA: {
            return produce(state, draft => {
                draft.agenda = [ ...state.agenda, action.agenda];
            });
        }

        case types.UPDATE_AGENDAMENTO: {
            return produce(state, draft => {
                if (action.agendamento.servicoId) {
                    draft.form.modalAgendamento = 1
                }
                draft.agendamento = { ...state.agendamento, ...action.agendamento };
            });
        }

        default:
            return state;
    }
}

export default manicure;