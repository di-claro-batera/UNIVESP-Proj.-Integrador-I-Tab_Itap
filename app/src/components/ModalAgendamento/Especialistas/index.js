import React, { useState } from 'react';
import { Box, Text, Cover, Button } from '../../../styles';
import theme from '../../../styles/theme.json';
import { StyleSheet } from 'react-native';
import { useFontSize } from '../FontSizeContext'; // Importando o contexto do tamanho da fonte
import EspecialistaModal from './modal'; // Certifique-se de importar a modal corretamente

const EspecialistaPicker = () => {
    const [isModalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade da modal
    const { fontScale } = useFontSize(); // Usando o contexto do tamanho da fonte

    return (
        <>
            <Text bold color="dark" hasPadding style={{ fontSize: 16 * fontScale }}>
                Selecione o Modo de Atendimento:
            </Text>
            <Box hasPadding removePaddingBottom removePaddingTop>
                <Box align="center">
                    <Cover
                        width="45px"
                        height="45px"
                        circle
                        image="https://www.primecursos.com.br/arquivos/uploads/2013/08/manicure-pedicure.jpg"
                    />
                    <Box direction="column">
                        <Text style={[styles.nameText, { fontSize: 18 * fontScale }]}>Marineuza Pires</Text>
                        <Text style={[styles.subText, { fontSize: 14 * fontScale }]} small>Atendimento a Domicílio</Text>
                    </Box>
                </Box>
                <Box>
                    <Button
                        uppercase={false}
                        textColor={theme.colors.dark}
                        background={theme.colors.light}
                        mode="contained"
                        block
                        labelStyle={[styles.buttonText, { fontSize: 16 * fontScale }]}
                        style={styles.buttonBackground}
                        onPress={() => setModalVisible(true)} // Abre a modal ao clicar no botão
                    >
                        Trocar Atendimento
                    </Button>
                </Box>
            </Box>
            <EspecialistaModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)} // Fecha a modal
            />
        </>
    );
};

const styles = StyleSheet.create({
    nameText: {
        fontFamily: theme.fonts.regular.fontFamily, // Fonte personalizada para nome
    },
    subText: {
        fontFamily: theme.fonts.light.fontFamily, // Fonte personalizada para subtítulo
    },
    buttonText: {
        fontFamily: theme.fonts.medium.fontFamily, // Fonte personalizada para botão
        color: theme.colors.dark, // Mudei para combinar com o textColor
    },
    buttonBackground: {
        backgroundColor: '#F5F6F7', // Cor mais clara para o fundo do botão
        borderColor: theme.colors.dark, // Cor da borda
        borderWidth: 1, // Largura da borda
        borderRadius: 10, // Ajuste o raio da borda
    },
});

export default EspecialistaPicker;
