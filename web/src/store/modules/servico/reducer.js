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
    servicos: [],
    servico: {
      titulo: '',
      preco: '',
      comissao: '',
      duracao: 30,
      recorrencia: '',
      descricao: '',
      status: 'A',
      arquivos: [],
    },
  };

function servico(state = INITIAL_STATE, action) {
    switch(action.type) {
        case types.UPDATE_SERVICO: {
            return produce(state, draft => {
                draft = { ...draft, ...action.payload};
                return draft;
            });
        }

        case types.RESET_SERVICO: {
            return produce(state, draft => {
                draft.servico = INITIAL_STATE.servico;
                return draft;
            });
        }

        default: 
        return state;
    }
}

export default servico;