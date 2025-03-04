import types from './types';
import { produce } from 'immer';
import consts from '../../../consts';
import * as _ from 'lodash';

const INITIAL_STATE = {
    manicure: {
        isOpened: false,
    },
    servicos: [],
    agenda: [],
    colaboradores: [],
    agendamento: {
        clienteId: consts.clienteId,
        manicureId: consts.manicureId,
        servicoId: null, // Inicialmente null
        colaboradorId: null, // Inicialmente null
        data: null, // Inicialmente null
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
                draft.manicure = { ...draft.manicure, ...action.manicure };
            });
        }

        case types.UPDATE_SERVICOS: {
            return produce(state, draft => {
                draft.servicos = action.servicos;

                // Define o primeiro serviço como padrão se ainda não estiver definido
                if (!draft.agendamento.servicoId && draft.servicos.length > 0) {
                    draft.agendamento.servicoId = draft.servicos[0]._id;
                }
            });
        }

        case types.UPDATE_FORM: {
            return produce(state, draft => {
                draft.form = { ...state.form, ...action.form };
            });
        }

        case types.UPDATE_AGENDA: {
            return produce(state, draft => {
                draft.agenda = [...state.agenda, ...action.agenda];

                // Define a primeira data disponível como padrão se ainda não estiver definida
                if (!draft.agendamento.data && draft.agenda.length > 0) {
                    const primeiraDataDisponivel = draft.agenda[0]; // Ajuste conforme a estrutura da agenda
                    draft.agendamento.data = primeiraDataDisponivel;
                }
            });
        }

        case types.UPDATE_COLABORADORES: {
            return produce(state, draft => {
                draft.colaboradores = _.uniqBy([
                    ...state.colaboradores,
                    ...action.colaboradores,
                ], '_id');

                // Define o primeiro colaborador como padrão se ainda não estiver definido
                if (!draft.agendamento.colaboradorId && draft.colaboradores.length > 0) {
                    draft.agendamento.colaboradorId = draft.colaboradores[0]._id;
                }
            });
        }

        case types.UPDATE_AGENDAMENTO: {
            return produce(state, draft => {
                if (action.agendamento.servicoId) {
                    draft.form.modalAgendamento = 1;
                }
                draft.agendamento = { ...state.agendamento, ...action.agendamento };
            });
        }

        case types.CLOSE_MODAL_AGENDAMENTO: {
            return produce(state, draft => {
                draft.form.modalAgendamento = 0; // Fecha a modal
            });
        }

        default:
            return state;
    }
}

export default manicure;