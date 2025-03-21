import { produce } from 'immer';
import types from './types';

const INITIAL_STATE = {
    behavior: 'create',
    components: {
        drawer: false,
        confirmDelete: false
    },
    form: {
        filtering: false,
        disabled: true,
        saving: false,
    },
    colaboradores: [], // Adicionado o array vazio
    colaboradoresDisponiveis: [], // Adicionado o array vazio
    servicos: [],
    colaborador: {
        email: '',
        nome: '',
        telefone: '',
        dataNascimento: '',
        sexo: 'M',
        vinculo: 'A',
        especialidades: [], // Adicionado o array vazio
        contaBancaria: {
            titular: '',
            cpfCnpj: '',
            banco: '',
            tipo: 'conta_corrente',
            agencia: '',
            numero: '',
            dc: '',
        },
    },
};

function colaborador(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.UPDATE_COLABORADOR: {
            return produce(state, draft => {
                draft = { ...draft, ...action.payload };
                return draft;
            });
        }

        case types.RESET_COLABORADOR: {
            return produce(state, draft => {
                draft.colaborador = INITIAL_STATE.colaborador;
                return draft;
            });
        }

        case types.COLABORADORES_DISPONIVEIS: {
            return produce(state, draft => {
                draft.colaboradoresDisponiveis = action.payload.colaboradores;
                return draft;
            });
        }

        default:
            return state;
    }
}

export default colaborador;