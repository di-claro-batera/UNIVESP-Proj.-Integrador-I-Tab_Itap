import React, { useCallback, useRef, useMemo, useState, useEffect } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FontSizeProvider, useFontSize } from './FontSizeContext';
import ModalHeader from './header';
import Resume from './resume';
import theme from '../../styles/theme.json';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTime from './dateTime';
import EspecialistaPicker from './Especialistas';
import EspecialistaModal from './Especialistas/modal';
import PaymentPicker from './payment';
import { Box } from '../../styles';
import { useSelector, useDispatch } from 'react-redux';
import util from '../../util';
import moment from 'moment';
import { updateAgendamento } from '../../store/modules/manicure/actions';
import { Button } from 'react-native-paper';
import { saveAgendamento } from '../../store/modules/manicure/sagas';
import { saveAgendamentoRequest } from '../../store/modules/manicure/actions';

const ModalAgendamento = () => {
    const { form, agendamento, servicos, agenda, colaboradores } = useSelector(state => state.manicure);
    const dispatch = useDispatch();
    const sheetRef = useRef(null);

    const dataSelecionada = moment(agendamento.data).format('YYYY-MM-DD');
    const horaSelecionada = moment(agendamento.data).format('HH:mm');
    const { horariosDisponiveis, colaboradoresDia } = util.selectAgendamento(agenda, dataSelecionada, agendamento.colaboradorId);

    const servico = servicos.find((s) => s._id === agendamento.servicoId);
    const servicoValido = servico ? servico : null;

    const [isExpanded, setIsExpanded] = useState(false);
    const [isEspecialistaModalVisible, setEspecialistaModalVisible] = useState(false);

    const { fontScale, increaseFontSize, decreaseFontSize } = useFontSize();
    const snapPoints = useMemo(() => ['100%', '99%'], []);

    // Logs para depuração
    console.log('Serviço selecionado:', servicoValido);
    console.log('Agendamento atual:', agendamento);

    // Define um colaborador padrão ao carregar a página
    useEffect(() => {
        if (colaboradores.length > 0 && !agendamento.colaboradorId) {
            const colaboradorPadrao = colaboradores[0]; // Primeiro colaborador da lista
            dispatch(updateAgendamento({ colaboradorId: colaboradorPadrao._id }));
        }
    }, [colaboradores, agendamento.colaboradorId, dispatch]);

    const openModal = useCallback(() => {
        if (sheetRef.current) {
            sheetRef.current.snapToIndex(1);
        }
    }, []);

    const closeModal = useCallback(() => {
        if (sheetRef.current) {
            sheetRef.current.snapToIndex(0);
        }
    }, []);

    const openEspecialistaModal = useCallback(() => {
        setEspecialistaModalVisible(true);
    }, []);

    const closeEspecialistaModal = useCallback(() => {
        setEspecialistaModalVisible(false);
    }, []);

    const handleColaboradorSelect = useCallback((colaborador) => {
        dispatch(updateAgendamento({ colaboradorId: colaborador._id }));
        closeEspecialistaModal();
    }, [dispatch]);

    const handleSheetChange = useCallback((index) => {
        console.log('handleSheetChange', index);
        setIsExpanded(index === 1);
    }, []);

    return (
        <GestureHandlerRootView style={[styles.container, { paddingTop: isExpanded ? 810 : 100 }]}>
            <BottomSheet
                ref={sheetRef}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChange}
                enablePanDownToClose={false}
                backgroundStyle={styles.bottomSheetBackground}
            >
                <BottomSheetView style={styles.contentContainer}>
                    <TouchableOpacity onPress={isExpanded ? closeModal : openModal} style={styles.touchable}>
                        <View style={styles.headerContainer}>
                            <LinearGradient
                                colors={['#6750A4', '#B45BD9']}
                                style={styles.gradientView}
                            >
                                <View style={styles.headerContent}>
                                    <Icon name="chevron-left" color={theme.colors.light} size={30} />
                                    <View style={styles.textContainer}>
                                        <Text style={styles.title}>Finalizar Agendamento</Text>
                                        <Text style={styles.subtitle}>Escolha horário e método de pagamento</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </View>
                    </TouchableOpacity>
                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                        {servicoValido ? (
                            <Resume servico={servicoValido} />
                        ) : (
                            <Box align="center" hasPadding>
                                <Text style={{ fontSize: 16 * fontScale, fontFamily: theme.fonts.regular.fontFamily }}>
                                    Nenhum serviço selecionado.
                                </Text>
                            </Box>
                        )}
                        <DateTime 
                            servico={servicoValido} 
                            agenda={agenda}
                            dataSelecionada={dataSelecionada}
                            horaSelecionada={horaSelecionada}
                            horariosDisponiveis={horariosDisponiveis}
                        />
                        <EspecialistaPicker
                            colaboradores={colaboradores}
                            agendamento={agendamento}
                            onOpenEspecialistaModal={openEspecialistaModal}
                        />
                        {/* Passa as props corretamente para o PaymentPicker */}
                        <PaymentPicker 
                            agendamento={agendamento} // Passa o agendamento atual
                            servico={servicoValido}   // Passa o serviço selecionado
                        />
                        <Box hasPadding>
                            <LinearGradient
                                colors={['#6750A4', '#B45BD9']}
                                style={styles.gradientButton}
                            >
                                <TouchableOpacity
                                    style={styles.buttonContainer}
                                    onPress={() => dispatch(saveAgendamentoRequest())}
                                    disabled={form.agendamentoLoading}
                                >
                                    <Icon name="check" color={theme.colors.light} size={32} />
                                    <Text style={styles.confirmButtonText}>Confirmar Meu Agendamento</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </Box>
                    </ScrollView>
                    <EspecialistaModal
                        isVisible={isEspecialistaModalVisible}
                        onClose={closeEspecialistaModal}
                        colaboradores={colaboradores}
                        onSelectColaborador={handleColaboradorSelect}
                        agendamento={agendamento}
                        servicos={servicos}
                        colaboradoresDia={colaboradoresDia}
                        horaSelecionada={horaSelecionada}
                    />
                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomSheetBackground: {
        backgroundColor: 'transparent',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollViewContent: {
        alignItems: 'flex-start',
        paddingTop: 0,
    },
    touchable: {
        padding: 1,
    },
    headerContainer: {
        width: '100%',
        height: 70,
        backgroundColor: 'rgba(255, 255, 255, 0.0)',
    },
    gradientView: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.0)',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginLeft: 20,
    },
    title: {
        color: theme.colors.light,
        fontSize: 24,
        fontFamily: "Pattaya-Regular",
    },
    subtitle: {
        color: theme.colors.light,
        fontSize: 14,
        fontFamily: "PoiretOne-Regular",
    },
    gradientButton: {
        borderRadius: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        width: '100%',
    },
    confirmButtonText: {
        color: theme.colors.light,
        fontSize: 20,
        fontFamily: "PoiretOne-Regular",
        marginLeft: 20,
        marginRight: 20,
    },
    fontButtonsContainer: {
        position: 'absolute',
        top: 90,
        right: 10,
        alignItems: 'center',
    },
    circleButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
    },
});

export default ModalAgendamento;