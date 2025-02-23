import React from 'react';
import { Text, Title, Box, Cover } from '../../styles';
import theme from '../../styles/theme.json';
import util from '../../util';
import { useFontSize } from './FontSizeContext'; // Importando o contexto do tamanho da fonte
import consts from '../../consts';

const Resume = ({ servico }) => {
    const { fontScale } = useFontSize(); // Usando o contexto do tamanho da fonte

    // Verifica se o serviço existe
    if (!servico) {
        return (
            <Box align="center" hasPadding background={util.toAlpha(theme.colors.muted, 5)}>
                <Text style={{ fontSize: 16 * fontScale, fontFamily: theme.fonts.regular.fontFamily }}>
                    Nenhum serviço selecionado.
                </Text>
            </Box>
        );
    }

    return (
        <Box align="center" hasPadding background={util.toAlpha(theme.colors.muted, 5)}>
            {/* Verifica se servico.arquivos existe e tem pelo menos um item */}
            {servico?.arquivos?.[0]?.caminho && (
                <Cover
                    width="80px"
                    height="80px"
                    image={`${consts.bucketUrl}/${servico.arquivos[0].caminho}`}
                />
            )}
            <Box direction="column">
                <Title style={{ fontSize: 30 * fontScale, fontFamily: theme.fonts.regular.fontFamily }}>
                    {servico?.titulo || 'Título não disponível'}
                </Title>
                <Text style={{ fontSize: 16 * fontScale, fontFamily: theme.fonts.regular.fontFamily }}>
                    Total R$ {servico?.preco || '0,00'}
                </Text>
            </Box>
        </Box>
    );
};

export default Resume;