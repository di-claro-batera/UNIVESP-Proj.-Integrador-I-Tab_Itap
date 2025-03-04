import React, { useState } from "react";
import { Text, Box, Touchable, Cover, Button } from '../../styles';
import { useFontSize } from '../../components/ModalAgendamento/FontSizeContext';
import moment from "moment";
import consts from "../../consts";
import { useDispatch, useSelector } from "react-redux";
import { updateAgendamento, filterAgenda } from "../../store/modules/manicure/actions";

const Servico = ({ servico }) => {
    console.log("Servico recebido:", servico); // Depuração

    const dispatch = useDispatch();
    const { fontScale } = useFontSize();
    const { agendamento } = useSelector(state => state.manicure);
    const [isSelected, setIsSelected] = useState(false);

    const isServicoSelected = agendamento.servicoId === servico._id;

    const duracaoEmMinutos = servico.duracao;
    console.log("Duração do serviço (minutos):", duracaoEmMinutos); // Depuração

    const horas = Math.floor(duracaoEmMinutos / 60);
    const minutos = duracaoEmMinutos % 60;
    const duracaoCorrigida = minutos === 0 ? `${horas}h` : `${horas}h ${minutos}m`;

    const handleSelectServico = () => {
        console.log("Servico selecionado:", servico._id); // Depuração
        console.log("Agendamento atual:", agendamento); // Depuração

        if (isServicoSelected) {
            dispatch(updateAgendamento({ servicoId: null }));
            setIsSelected(false);
        } else {
            dispatch(updateAgendamento({ servicoId: servico._id }));
            setIsSelected(true);
            dispatch(filterAgenda());
        }
    };

    return (
        <Touchable 
            height="100px" 
            background="light"
            align="center"
            hasPadding
            onPress={handleSelectServico}
        >
            <Cover 
                image={
                    servico?.arquivos && servico.arquivos[0]?.caminho
                        ? `${consts.bucketUrl}/${servico.arquivos[0].caminho}`
                        : 'https://via.placeholder.com/150' // Imagem padrão
                }
            />
            <Box direction="column">
                <Text bold color="dark" style={{ fontSize: 16 * fontScale }}>
                    {servico.titulo}
                </Text>
                <Text bold small color="dark" style={{ fontSize: 14 * fontScale }}>
                    R${servico.preco}.00 • {duracaoCorrigida}
                </Text>
            </Box>
            <Box>
                <Button 
                    icon="clock-check-outline" 
                    background={isServicoSelected ? "#B159D6" : "light"}
                    mode="contained"
                    labelStyle={{ 
                        fontSize: 14 * fontScale,
                        color: isServicoSelected ? "#fff" : "#000",
                    }}
                    accessibilityLabel="Agendar"
                    accessibilityHint="Dê um toque duplo para agendar um horário"
                    style={{ 
                        width: 'auto',
                        borderWidth: isServicoSelected ? 5 : 0,
                        borderColor: isServicoSelected ? "#460071" : "transparent",
                    }} 
                >
                    AGENDAR
                </Button>
            </Box>
        </Touchable>
    );
};

export default Servico;