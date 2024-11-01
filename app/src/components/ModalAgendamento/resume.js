import React from 'react';
import { Text, Title, Box, Cover } from '../../styles';
import theme from '../../styles/theme.json';
import util from '../../util';
import { useFontSize } from './FontSizeContext'; // Importando o contexto do tamanho da fonte

const Resume = () => {
    const { fontScale } = useFontSize(); // Usando o contexto do tamanho da fonte

    return (
        <Box align="center" hasPadding background={util.toAlpha(theme.colors.muted, 5)}>
            <Cover
                width="80px"
                height="80px"
                image="https://cleanexpressdescartaveis.com.br/wp-content/webp-express/webp-images/uploads/2021/10/clean.jpg.webp"
            />
            <Box direction="column">
                <Title style={[styles.title, { fontSize: 30 * fontScale }]}>Manicure</Title>
                <Text style={[styles.customText, { fontSize: 16 * fontScale }]}>
                    Total R$40,00
                </Text>
            </Box>
        </Box>
    );
};

const styles = {
    title: {
        fontFamily: theme.fonts.regular.fontFamily, // Usando "PoiretOne-Regular" para o título
    },
    customText: {
        fontFamily: theme.fonts.regular.fontFamily, // Usando "PragatiNarrow-Regular" para o texto
    },
};

export default Resume;
