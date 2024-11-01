import types from './types';
import produce from 'immer';
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
        agendamentoLoading:false,
    },
};

function manicure(state = INITIAL_STATE, action) {
    switch (action.type) {
        default:
            return state;
    }
}

export default manicure;