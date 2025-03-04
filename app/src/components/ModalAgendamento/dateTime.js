import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { Box, Title, Text, Touchable } from '../../styles';
import util from '../../util';
import theme from '../../styles/theme.json';
import { updateAgendamento } from '../../store/modules/manicure/actions';
import moment from 'moment/min/moment-with-locales';
moment.locale('pt-br');
import { useFontSize } from './FontSizeContext';
import { useDispatch } from 'react-redux';

const DateTime = ({
    servico,
    agenda,
    dataSelecionada,
    horaSelecionada,
    horariosDisponiveis
}) => {
    const dispatch = useDispatch();
    const { fontScale } = useFontSize();

    const [diasDisponiveis, setDiasDisponiveis] = useState(agenda);

    const verificarDiaDisponivel = (dia) => {
        const hoje = moment().format('YYYY-MM-DD');
        const diaAtual = moment(dia).format('YYYY-MM-DD');

        if (diaAtual !== hoje) {
            return true;
        }

        const horarioAtual = moment().format('HH:mm');
        const ultimoHorarioDisponivel = '17:00';

        return moment(horarioAtual, 'HH:mm').isBefore(moment(ultimoHorarioDisponivel, 'HH:mm'));
    };

    useEffect(() => {
        const diasFiltrados = agenda.filter((item) => {
            const dia = Object.keys(item)[0];
            return verificarDiaDisponivel(dia);
        });
        setDiasDisponiveis(diasFiltrados);
    }, [agenda]);

    const setAgendamento = (value, isTime = false) => {
        const { horariosDisponiveis } = util.selectAgendamento(agenda, isTime ? dataSelecionada : value);

        if (!Array.isArray(horariosDisponiveis) || horariosDisponiveis.length === 0) {
            console.error('Nenhum horário disponível encontrado.');
            return;
        }

        if (!dataSelecionada) {
            console.error('Data selecionada não está definida.');
            return;
        }

        let data = !isTime ? `${value}T${horariosDisponiveis[0][0]}` : `${dataSelecionada}T${value}`;
        dispatch(updateAgendamento({ data }));
    };

    return (
        <>
            <Text bold color="dark" hasPadding style={{ fontSize: 16 * fontScale }}>
                Por favor, escolha a data do seu agendamento:
            </Text>
            <FlatList
                data={diasDisponiveis}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `${Object.keys(item)[0]}-${index}`} // Chave única para cada dia
                renderItem={({ item }) => {
                    const date = moment(Object.keys(item)[0]);
                    const dateISO = moment(date).format('YYYY-MM-DD');
                    const selected = dateISO === dataSelecionada;

                    return (
                        <Touchable
                            key={dateISO} // Chave única para o Touchable
                            width="70px"
                            height="90px"
                            spacing="0 7px 0"
                            rounded="10px"
                            direction="column"
                            justify="center"
                            align="center"
                            border={`1px solid ${selected ? theme.colors.primary : util.toAlpha(theme.colors.muted, 100)}`}
                            background={selected ? 'primary' : 'light'}
                            onPress={() => setAgendamento(dateISO)}
                        >
                            <Text small color={selected ? 'light' : undefined} style={{ fontSize: 12 * fontScale }}>
                                {util.diasSemana[date.day()]}
                            </Text>
                            <Title small color={selected ? 'light' : undefined} style={{ fontSize: 20 * fontScale }}>
                                {date.format('DD')}
                            </Title>
                            <Text small color={selected ? 'light' : undefined} style={{ fontSize: 12 * fontScale }}>
                                {date.format('MMMM')}
                            </Text>
                        </Touchable>
                    );
                }}
            />
            <Text bold color="dark" hasPadding style={{ fontSize: 16 * fontScale }}>
                Agora, escolha um horário disponível:
            </Text>
            <FlatList
                data={horariosDisponiveis}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 20 }}
                keyExtractor={(item, index) => `${dataSelecionada}-${index}`} // Chave única para cada horário
                renderItem={({ item }) => (
                    <Box direction="column" spacing="0 10px 0 0">
                        {item.map((horario) => {
                            const selected = horario === horaSelecionada;
                            return (
                                <Touchable
                                    key={`${dataSelecionada}-${horario}`} // Chave única para cada horário
                                    width="100px"
                                    height="35px"
                                    spacing="0 0 5px 0"
                                    background={selected ? 'primary' : 'light'}
                                    rounded="7px"
                                    justify="center"
                                    align="center"
                                    border={`1px solid ${selected ? theme.colors.primary : util.toAlpha(theme.colors.muted, 100)}`}
                                    onPress={() => setAgendamento(horario, true)}
                                >
                                    <Text color={selected ? "light" : undefined} style={{ fontSize: 14 * fontScale }}>
                                        {horario}
                                    </Text>
                                </Touchable>
                            );
                        })}
                    </Box>
                )}
            />
        </>
    );
};

export default DateTime;