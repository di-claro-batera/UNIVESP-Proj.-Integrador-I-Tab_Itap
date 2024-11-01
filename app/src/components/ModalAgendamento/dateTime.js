import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { Box, Title, Text, Touchable } from '../../styles';
import util from '../../util';
import theme from '../../styles/theme.json';
import { useFontSize } from './FontSizeContext'; // Importando o contexto do tamanho da fonte

const DateTime = () => {
    const { fontScale } = useFontSize(); // Usando o contexto do tamanho da fonte

    return (
        <>
            <Text bold color="dark" hasPadding style={{ fontSize: 16 * fontScale }}>
                Por favor, escolha a data do seu agendamento:
            </Text>
            <FlatList
                data={['a', 'b', 'c', 'd', 'e', 'f']}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <Touchable
                        key={item}
                        width="70px"
                        height="90px"
                        spacing="0 7px 0"
                        rounded="10px"
                        direction="column"
                        justify="center"
                        align="center"
                        border={`1px solid ${item === 'a' ? theme.colors.primary : util.toAlpha(theme.colors.muted, 100)}`}
                        background={item === "a" ? 'primary' : 'light'}
                    >
                        <Text small color={item === "a" ? 'light' : undefined} style={{ fontSize: 12 * fontScale }}>Dom</Text>
                        <Title small color={item === "a" ? 'light' : undefined} style={{ fontSize: 20 * fontScale }}>15</Title>
                        <Text small color={item === "a" ? 'light' : undefined} style={{ fontSize: 12 * fontScale }}>Dez</Text>
                    </Touchable>
                )}
            />
            <Text bold color="dark" hasPadding style={{ fontSize: 16 * fontScale }}>
                Agora, escolha um horário disponível:
            </Text>
            <FlatList
                data={[
                    ['7:00', '8:00'],
                    ['9:00', '10:00'],
                    ['11:00', '12:00'],
                    ['13:00', '14:00'],
                    ['15:00', '16:00'],
                ]}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 20 }}
                renderItem={({ item }) => (
                    <Box direction="column" spacing="0 10px 0 0">
                        {item.map(horario => (
                            <Touchable
                                key={horario}
                                width="100px"
                                height="35px"
                                spacing="0 0 5px 0"
                                background={horario === '7:00' ? 'primary' : 'light'}
                                rounded="7px"
                                justify="center"
                                align="center"
                                border={`1px solid ${horario === '7:00' ? theme.colors.primary : util.toAlpha(theme.colors.muted, 100)}`}
                            >
                                <Text color={horario === "7:00" ? "light" : undefined} style={{ fontSize: 14 * fontScale }}>
                                    {horario}
                                </Text>
                            </Touchable>
                        ))}
                    </Box>
                )}
            />
        </>
    );
};

export default DateTime;
