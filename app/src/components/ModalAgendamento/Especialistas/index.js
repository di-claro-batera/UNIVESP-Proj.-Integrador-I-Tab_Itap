import React from 'react';
import { Box, Text, Cover, Button } from '../../../styles';
import theme from '../../../styles/theme.json';
import { StyleSheet, View } from 'react-native';
import { useFontSize } from '../FontSizeContext';

const EspecialistaPicker = ({ colaboradores, agendamento, onOpenEspecialistaModal }) => {
    const { fontScale } = useFontSize();

    const colaboradorSelecionado = colaboradores.find(c => c._id === agendamento.colaboradorId) || {
        foto: 'https://via.placeholder.com/150', // URL de uma imagem padrão
        nome: 'Colaborador não selecionado', // Nome padrão
    };

    console.log("Colaborador selecionado:", colaboradorSelecionado); // Depuração

    return (
        <>
            <Text bold color="dark" hasPadding style={{ fontSize: 16 * fontScale }}>
                Escolha o Colaborador:
            </Text>
            <Box hasPadding removePaddingBottom removePaddingTop>
                <Box direction="row" align="center" justify="space-between">
                    <Box direction="row" align="center" spacing="0 10px 0 0">
                        <Cover
                            width="45px"
                            height="45px"
                            circle
                            image={colaboradorSelecionado.foto}
                        />
                        <Box direction="column" style={styles.nameContainer}>
                            <Text style={[styles.nameText, { fontSize: 18 * fontScale }]}>
                                {colaboradorSelecionado.nome}
                            </Text>
                        </Box>
                    </Box>
                    <Button
                        uppercase={false}
                        textColor={theme.colors.dark}
                        background={theme.colors.light}
                        mode="contained"
                        labelStyle={[styles.buttonText, { fontSize: 16 * fontScale }]}
                        style={styles.buttonBackground}
                        onPress={onOpenEspecialistaModal}
                    >
                        <View style={styles.buttonTextContainer}>
                            <Text style={styles.buttonText}>Trocar</Text>
                            <Text style={styles.buttonText}>Colaborador</Text>
                        </View>
                    </Button>
                </Box>
            </Box>
        </>
    );
};

const styles = StyleSheet.create({
    nameContainer: {
        flex: 1, // Ocupa o espaço disponível
        marginRight: 8, // Espaçamento entre o nome e o botão
    },
    nameText: {
        fontFamily: theme.fonts.regular.fontFamily,
        flexShrink: 1, // Permite que o texto quebre para a próxima linha se necessário
    },
    buttonText: {
        fontFamily: theme.fonts.medium.fontFamily,
        color: theme.colors.dark,
        textAlign: 'center', // Centraliza o texto no botão
        fontSize: 14, // Tamanho do texto do botão (ajuste aqui)
    },
    buttonBackground: {
        backgroundColor: '#F5F6F7',
        borderColor: theme.colors.dark,
        borderWidth: 1,
        borderRadius: 10,
        width: 130, // Largura do botão (ajuste aqui)
        paddingVertical: 5, // Espaçamento interno vertical (ajuste aqui)
        paddingHorizontal: 1, // Espaçamento interno horizontal (ajuste aqui)
    },
    buttonTextContainer: {
        alignItems: 'center', // Centraliza o conteúdo
    },
});

export default EspecialistaPicker;