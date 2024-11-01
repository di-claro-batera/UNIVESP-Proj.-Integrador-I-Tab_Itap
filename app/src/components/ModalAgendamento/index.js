import React, { useCallback, useRef, useMemo, useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FontSizeProvider, useFontSize } from './FontSizeContext'; // Importando FontSizeProvider e useFontSize
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

const ModalAgendamentoContent = () => {
    const sheetRef = useRef(null);
    const [paddingTop, setPaddingTop] = useState(100);
    const [isExpanded, setIsExpanded] = useState(false);
    const { fontScale, increaseFontSize, decreaseFontSize } = useFontSize(); // Usando o contexto de tamanho de fonte
    const snapPoints = useMemo(() => ['100%', '99%'], []);

    const handleSheetChange = useCallback((index) => {
        console.log('handleSheetChange', index);
        setIsExpanded(index === 1);
    }, []);

    const handleSnapTo95 = useCallback(() => {
        setPaddingTop(800);
        sheetRef.current?.snapToIndex(1);
    }, []);

    const handleCloseSheet = useCallback(() => {
        setPaddingTop(100);
        sheetRef.current?.snapToIndex(0);
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
                    <TouchableOpacity onPress={isExpanded ? handleCloseSheet : handleSnapTo95} style={styles.touchable}>
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
                        <Resume />
                        <DateTime />
                        <EspecialistaPicker />
                        <PaymentPicker />
                        <Box hasPadding>
                            <LinearGradient
                                colors={['#6750A4', '#B45BD9']}
                                style={styles.gradientButton}
                            >
                                <TouchableOpacity style={styles.buttonContainer}>
                                    <Icon name="check" color={theme.colors.light} size={32} />
                                    <Text style={styles.confirmButtonText}>Confirmar Meu Agendamento</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </Box>
                    </ScrollView>
                    <View style={styles.fontButtonsContainer}>
                        <TouchableOpacity
                            onPress={decreaseFontSize}
                            style={styles.circleButton}
                            accessibilityLabel="Diminuir Tamanho da Fonte"
                            accessibilityHint="Dê um toque duplo para diminuir o tamanho da fonte"
                        >
                            <Text style={styles.buttonText}>A-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={increaseFontSize}
                            style={styles.circleButton}
                            accessibilityLabel="Aumentar Tamanho da Fonte"
                            accessibilityHint="Dê um toque duplo para aumentar o tamanho da fonte"
                        >
                            <Text style={styles.buttonText}>A+</Text>
                        </TouchableOpacity>
                    </View>
                    <EspecialistaModal />
                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
};

const ModalAgendamento = () => (
    <FontSizeProvider>
        <ModalAgendamentoContent />
    </FontSizeProvider>
);

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
        borderRadius: 1, // Para garantir que seja um círculo
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
