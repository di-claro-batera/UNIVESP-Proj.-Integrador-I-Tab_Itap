import React from 'react';
import { Cover, GradientView, Title, Text, Badge, Box, Touchable, Button, TextInput } from '../../styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../../styles/theme.json';
import { Linking, View } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { useFontSize } from '../../components/ModalAgendamento/FontSizeContext'; // Importando o contexto do tamanho da fonte

const Header = () => {
    const { fontScale, increaseFontSize, decreaseFontSize } = useFontSize(); // Usando o contexto de tamanho de fonte

    const openGoogleMaps = () => {
        const url = 'https://www.google.com/maps/search/?api=1&query=-21.732531,-48.686678';
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    };

    return (
        <>
            <Cover
                image="https://cleanexpressdescartaveis.com.br/wp-content/webp-express/webp-images/uploads/2021/10/clean.jpg.webp"
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
                    <Badge color="sucess">ABERTO</Badge>
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
                        accessibilityLabel="Compartilhar Mari Care"
                        accessibilityHint="Dê um toque duplo para compartilhar"
                    >
                        <Icon name="share" size={28} color={theme.colors.muted} />
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
                <Title small style={styles(fontScale).titleSmall}>Serviços (3)</Title>
                <TextInput
                    placeholder="Digite o nome do serviço..."
                    accessibilityLabel="Campo de busca"
                    accessibilityHint="Digite o nome do serviço que está procurando"
                />
            </Box>
        </>
    );
};

const styles = (fontScale) => ScaledSheet.create({
    title: {
        fontSize: moderateScale(36 * fontScale), // Usando moderateScale para garantir valores numéricos
    },
    text: {
        fontSize: moderateScale(15 * fontScale), // Usando moderateScale para garantir valores numéricos
    },
    titleSmall: {
        fontSize: moderateScale(20 * fontScale), // Usando moderateScale para garantir valores numéricos
    },
    fontButtonsContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        alignItems: 'center',
    },
    circleButton: {
        width: 40, // Dimensão ajustada para ser menor
        height: 40, // Dimensão ajustada para ser menor
        borderRadius: 20, // Para formar um círculo
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        overflow: 'hidden', // Garantir que qualquer conteúdo extra seja cortado
    },
    buttonText: {
        color: '#fff',
        fontSize: 12, // Tamanho da fonte ajustado para caber no botão
    },
});

export default Header;
