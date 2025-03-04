import React from 'react';
import { ScrollView, StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Text, Box, Cover } from '../../../styles';
import theme from '../../../styles/theme.json';
import { useDispatch } from 'react-redux';
import { updateAgendamento } from '../../../store/modules/manicure/actions';
import moment from 'moment';

const EspecialistaModal = ({
    isVisible,
    onClose,
    colaboradores = [], // Valor padrão: array vazio
    agendamento,
    servicos,
    colaboradoresDia = {}, // Valor padrão: objeto vazio
    horaSelecionada,
}) => {
    const dispatch = useDispatch();
    const colaboradoresIdsDisponiveis = [];

    // Verifica se colaboradoresDia é um objeto válido
    if (colaboradoresDia && typeof colaboradoresDia === 'object') {
        for (let colaboradorId of Object.keys(colaboradoresDia)) {
            let horarios = colaboradoresDia[colaboradorId].flat(2);
            if (horarios.includes(horaSelecionada)) {
                colaboradoresIdsDisponiveis.push(colaboradorId);
            }
        }
    }

    // Filtra os colaboradores disponíveis
    const colaboradoresDisponiveis = Array.isArray(colaboradores)
        ? colaboradores.filter((c) => colaboradoresIdsDisponiveis.includes(c._id))
        : [];

    // Encontra o serviço selecionado
    const servico = servicos?.find((s) => s._id === agendamento?.servicoId);

    // Depuração dos dados recebidos
    console.log("Colaboradores disponíveis:", colaboradoresDisponiveis);
    console.log("Serviço selecionado:", servico);
    console.log("Agendamento atual:", agendamento);

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            style={styles.modal}
        >
            <View style={styles.modalContent}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <Box hasPadding direction="column">
                        <Text bold color="dark">
                            {servico?.titulo || 'Serviço não selecionado'}
                        </Text>
                        <Text small>
                            Disponíveis em {moment(agendamento?.data).format('DD/MM/YYYY [às] HH:mm')}
                        </Text>

                        {/* Verifica se há colaboradores disponíveis */}
                        {colaboradoresDisponiveis.length > 0 ? (
                            <Box
                                direction="row" // Coloca os itens em linha
                                wrap="wrap" // Quebra para a próxima linha se não couber
                                spacing="10px 0 0"
                            >
                                {colaboradoresDisponiveis.map((colaborador) => (
                                    <TouchableOpacity
                                        key={colaborador._id}
                                        style={styles.colaboradorItem}
                                        onPress={() => {
                                            console.log("Colaborador selecionado:", colaborador._id);
                                            dispatch(updateAgendamento({ colaboradorId: colaborador._id }));
                                            onClose(); // Fecha o modal após a seleção
                                        }}
                                    >
                                        <Cover
                                            width="75px"
                                            height="75px"
                                            circle
                                            border={
                                                colaborador._id === agendamento?.colaboradorId
                                                    ? `2px solid ${theme.colors.primary}`
                                                    : 'none'
                                            }
                                            image={colaborador?.foto || 'https://via.placeholder.com/150'}
                                        />
                                        <Box direction="column" align="center" spacing="5px 0 0 0">
                                            <Text bold>{colaborador?.nome || 'Colaborador não disponível'}</Text>
                                        </Box>
                                    </TouchableOpacity>
                                ))}
                            </Box>
                        ) : (
                            <Box align="center" spacing="10px 0 0">
                                <Text>Nenhum colaborador disponível para o horário selecionado.</Text>
                            </Box>
                        )}
                    </Box>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        maxHeight: Dimensions.get('window').height * 0.8,
    },
    scrollViewContent: {
        paddingVertical: 20,
    },
    colaboradorItem: {
        width: '50%', // Dois itens por linha
        alignItems: 'center', // Centraliza o conteúdo
        marginBottom: 10, // Espaçamento entre os itens
    },
});

export default EspecialistaModal;