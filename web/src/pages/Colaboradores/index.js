import 'rsuite/dist/rsuite.min.css';
import { useEffect } from 'react';
import { Button, Drawer, Modal, IconButton, TagPicker } from 'rsuite';
import Table from '../../components/Table';
import moment from 'moment';
import RemindFillIcon from '@rsuite/icons/RemindFill';

import { useDispatch, useSelector } from 'react-redux';
import { 
    allColaboradores, 
    updateColaborador,
    filterColaboradores, 
    addColaborador,
    unlinkColaborador,
    allServicos
} from '../../store/modules/colaborador/actions';


const Colaboradores = () => {

    const dispatch = useDispatch();
    const { colaboradores, colaborador, behavior, form, components, servicos } = useSelector(
        (state)=> state.colaborador
        );

    const setComponent = (component, state) => {
        dispatch(
            updateColaborador({
                components: { ...components, [component]: state },
           })
        );
    };

    const setColaborador = (key, value) => {
        dispatch(
            updateColaborador({
                colaborador: { ...colaborador, [key]: value },
            })
        );
    };

    const save = () => {
        dispatch(addColaborador());
    };

    const remove = () => {
        dispatch(unlinkColaborador());
    };

    useEffect(() => {
        dispatch(allColaboradores());
        dispatch(allServicos());
        console.log('Estado atual do drawer:', components.drawer);
    }, [dispatch, components.drawer])

    return (
        <div className="col p-5 overflow-auto h-100">
            <Drawer 
                open={components.drawer} 
                size="sm"
                onClose={() => { 
                    console.log('Drawer fechado');
                    setComponent('drawer', false);
                }}
            >
                <Drawer.Body>
                    <h3>{behavior === 'create' ? 'Criar Novo' : 'Atualizar'} Colaborador</h3>
                    <div className="row mt-3">
                        <div className="form-group col-12">
                            <b className="">E-mail</b>
                            <div class="input-group mb-3">
                                <input
                                disabled={behavior === 'update'}
                                type="email"
                                className="form-control"
                                placeholder="E-mail do Colaborador"
                                value={colaborador.email}
                                onChange={ (e) => setColaborador('email', e.target.value)}
                                />
                                {behavior === 'create' && (
                                    <div class="input-group-append">
                                        <Button
                                        appearance="primary"
                                        loading={form.filtering}
                                        disabled={form.filtering}
                                        onClick={() => {
                                            dispatch(
                                                filterColaboradores());
                                        }}
                                        >
                                            Pesquisar
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    <div className="form-group col-6">
                        <b className="">Nome</b>
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Nome do Colaborador"
                        disabled={form.disabled}
                        value={colaborador.nome}
                        onChange={(e) => setColaborador('nome', e.target.value)}
                        />
                    </div>
                    <div className="form-group col-6">
                        <b className="">Status</b>
                        <select
                        className="form-control"
                        disabled={form.disabled && behavior === 'create'}
                        value={colaborador.vinculo}
                        onChange={(e) => setColaborador('vinculo', e.target.value)}
                        >
                            <option value="A">Ativo</option>
                            <option value="I">Inativo</option>
                        </select>
                    </div>
                    <div className="form-group col-4">
                        <b className="">Telefone / Whatssapp</b>
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Telefone / Whatsapp do Cliente"
                        disabled={form.disabled}
                        value={colaborador.telefone}
                        onChange={(e) => setColaborador('telefone', e.target.value)}
                        />
                    </div>
                    <div className="form-group col-4">
                        <b className="">Data de Nascimento</b>
                        <input
                        type="date"
                        className="form-control"
                        placeholder="Data de Nascimento do Cliente"
                        disabled={form.disabled}
                        value={colaborador.dataNascimento}
                        onChange={(e) => setColaborador('dataNascimento', e.target.value)}
                        />
                    </div>
                    <div className="form-group col-4">
                        <b className="">Sexo</b>
                        <select className="form-control"
                        disabled={form.disabled}
                        value={colaborador.sexo}
                        onChange={(e) => setColaborador('sexo',e.target.value)}
                        >
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                        </select>
                    </div>

                    <div className="col-12">
                        <b>Especialidades</b>
                        <TagPicker size="lg"
                        block 
                        data={servicos} 
                        disabled={form.disabled && behavior === "create"}
                        value={colaborador.especialidades}
                        onChange={(especialidade) => setColaborador('especialidades', especialidade)
                    }
                        />
                    </div>
                </div>
                <Button
            loading={form.saving}
            color={behavior === 'create' ? 'green' : 'violet'}
            size="lg"
            block
            onClick={() => save()}
            className="mt-3"
          >
            {behavior === 'create' ? "Salvar" : "Atualizar"} Colaborador
          </Button>
          {behavior === 'update' && (
            <Button
              loading={form.saving}
              color="red"
              size="lg"
              block
              onClick={() => setComponent('confirmDelete', true)}
              className="mt-1"
            >
              Remover Colaborador
            </Button>
          )}
                </Drawer.Body>
            </Drawer>
            <Modal
        open={components.confirmDelete}
        onClose={() => setComponent('confirmDelete', false)}
        size="xs"
      >
        <Modal.Body>
        <IconButton
            icon={<RemindFillIcon/>}
            style={{
              color: '#FF0000',
              fontSize: 24,
            }}
          />
          {'  '} Tem certeza que deseja excluir? Essa ação será irreversível!
        </Modal.Body>
        <Modal.Footer>
          <Button loading={form.saving} onClick={() => remove()} color="red">
            Sim, tenho certeza!
          </Button>
          <Button
            onClick={() => setComponent('confirmDelete', false)}
            appearance="subtle"
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>    

            <div className="row">
                <div className="col-12">
                    <div className="w-100 d-flex justify-content-between">
                        <h2 className="mb-4 mt-0">Colaboradores</h2>
                        <div>
                            <button 
                            className="btn btn-primary btn-lg"
                            onClick={() => {
                                console.log('Botão clicado');
                                dispatch(
                                    updateColaborador({
                                        behavior: 'create',
                                    })
                                );
                                setComponent('drawer', true);
                            }}
                            >
                            <span className="mdi mdi-plus">Novo Colaborador</span>
                            </button> 
                        </div>
                    </div>
                    <Table
                    loading={form.filtering}
                    data={colaboradores} 
                    config={[
                        {label: 'Nome', key: 'nome', width:150 },
                        {label: 'Email', key: 'email', width:150 },
                        {label: 'Telefone', key: 'telefone', width:150 },
                        {label: 'Data Cadastro', 
                        content: (colaborador) => 
                            moment(colaborador.dataCadastro).format('DD/MM/YYYY'), 
                        width:150 },
                        {label: 'Data Nascimento',
                        content: (colaborador) => 
                            moment(colaborador.dataNascimento).format('DD/MM/YYYY'),
                        width:150 },
                    ]}
                    actions={(colaborador) => (
                        <Button color="red" size="xs">
                            + Info
                        </Button>
                    )}
                    onRowClick={(colaborador) =>{
                        dispatch(
                            updateColaborador({
                                behavior: 'update',
                            })
                        );
                        dispatch(
                            updateColaborador({
                                colaborador,
                            })
                        );
                        setComponent('drawer', true);
                    }}
                    />
                </div>
            </div>
        </div>
    );
};


export default Colaboradores;
