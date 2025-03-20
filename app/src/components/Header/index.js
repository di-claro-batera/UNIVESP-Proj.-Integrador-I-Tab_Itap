import React from 'react';
import { Cover, GradientView, Title, Text, Badge, Box, Touchable, Button, TextInput } from '../../styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../../styles/theme.json';
import { Linking, View, Share } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { useFontSize } from '../../components/ModalAgendamento/FontSizeContext';
import { useSelector, useDispatch } from 'react-redux';
import { updateForm } from '../../store/modules/manicure/actions';

const Header = () => {
    const dispatch = useDispatch();
    const { manicure, servicos } = useSelector(state => state.manicure);
    const { fontScale, increaseFontSize, decreaseFontSize } = useFontSize();

    const openGoogleMaps = () => {
        const url = 'https://www.google.com/maps/search/?api=1&query=-21.732531,-48.686678';
        Linking.openURL(url).catch(error => console.error('An error occurred', error));
    };

    const handleShareOnWhatsApp = () => {
        const phoneNumber = '(16) 99775-1719'; // Número formatado para exibição
        const message = `Olá, aqui está o contato da Mari Care: ${phoneNumber}`;
    
        Share.share({
            message: message, // Mensagem que será compartilhada
        })
        .then((result) => {
            if (result.action === Share.sharedAction) {
                console.log('Compartilhado com sucesso!');
            } else if (result.action === Share.dismissedAction) {
                console.log('Compartilhamento cancelado.');
            }
        })
        .catch((error) => {
            console.error('Erro ao compartilhar:', error);
        });
    };

    return (
        <View style={{ marginBottom: 0, paddingBottom: 0 }}> 
            <Cover
                image="https://s28461.pcdn.co/wp-content/uploads/2015/12/Manicure-con-gel_-duradero-pero-problema%CC%81tico-para-la-salud.jpg"
                width="100%"
                height="220px"
            >
                <GradientView
                    hasPadding
                    justify="flex-end"
                    style={{ flexDirection: 'column-reverse' }}
                >
                    <Text color="light">Tabatinga-SP •</Text>
                    <Title color="light" style={styles(fontScale).title}>Mari Care</Title>
                    <Badge color={manicure.isOpened ? "sucess" : "danger"}>{manicure.isOpened ? 'ABERTO' : 'FECHADO'}</Badge>
                </GradientView>
                <View style={styles(fontScale).fontButtonsContainer}>
                    <Touchable onPress={decreaseFontSize} style={styles(fontScale).circleButton}>
                        <Text style={styles(fontScale).buttonText}>A-</Text>
                    </Touchable>
                    <Touchable onPress={increaseFontSize} style={styles(fontScale).circleButton}>
                        <Text style={styles(fontScale).buttonText}>A+</Text>
                    </Touchable>
                </View>
            </Cover>
            <Box background="light" align="center">
                <Box hasPadding justify="space-between">
                    <Touchable
                        width="60px"
                        direction="column"
                        align="center"
                        spacing="0px 10px 0 0"
                        onPress={() => Linking.openURL(`tel:01516997751719`)}
                        accessibilityLabel="Ligar para Mari Care"
                        accessibilityHint="Dê um toque duplo para ligar"
                    >
                        <Icon name="phone" size={28} color={theme.colors.muted} />
                        <Text small spacing="5px 0 0" style={styles(fontScale).text}>Ligar</Text>
                    </Touchable>
                    <Touchable
                        width="60px"
                        direction="column"
                        align="center"
                        onPress={openGoogleMaps}
                        accessibilityLabel="Visitar Mari Care"
                        accessibilityHint="Dê um toque duplo para abrir o Google Maps"
                    >
                        <Icon name="map-marker" size={28} color={theme.colors.muted} />
                        <Text small spacing="5px 0 0" style={styles(fontScale).text}>Visitar</Text>
                    </Touchable>
                    <Touchable
                        width="60px"
                        direction="column"
                        align="center"
                        onPress={handleShareOnWhatsApp}
                        accessibilityLabel="Compartilhar Mari Care"
                        accessibilityHint="Dê um toque duplo para compartilhar"
                    >
                        <Icon name="whatsapp" size={28} color={theme.colors.muted} />
                        <Text small spacing="5px 0 0" style={styles(fontScale).text}>Enviar</Text>
                    </Touchable>
                </Box>
                <Box hasPadding direction="column" align="center" justify="center">
                    <Button
                        icon="clock-check-outline"
                        background="sucess"
                        mode="contained"
                        uppercase={false}
                        accessibilityLabel="Agendar Agora"
                        accessibilityHint="Dê um toque duplo para agendar um horário"
                    >
                        Agendar Agora
                    </Button>
                    <Text small spacing="5px 0 0" style={styles(fontScale).text}>Horários Disponíveis</Text>
                </Box>
            </Box>
            <Box hasPadding direction="column" background="light" spacing="15px 0 0">
                <Title small style={styles(fontScale).titleSmall}>Serviços ({servicos.length})</Title>
                <TextInput
                    placeholder="Digite o nome do serviço..."
                    onChangeText={(value) => dispatch(updateForm({ inputFiltro: value }))}
                    onFocus={() => dispatch(updateForm({ inputFiltroFoco: true }))}
                    onBlur={() => dispatch(updateForm({ inputFiltroFoco: false }))}
                    accessibilityLabel="Campo de busca"
                    accessibilityHint="Digite o nome do serviço que está procurando"
                />
            </Box>
        </View>
    );
};

const styles = (fontScale) => ScaledSheet.create({
    title: {
        fontSize: moderateScale(36 * fontScale),
    },
    text: {
        fontSize: moderateScale(15 * fontScale),
    },
    titleSmall: {
        fontSize: moderateScale(20 * fontScale),
    },
    fontButtonsContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        alignItems: 'center',
    },
    circleButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        overflow: 'hidden',
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
    },
});

export default Header;
