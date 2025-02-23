import React, { useState } from "react";
import { Text, Box, Touchable, Cover, Button } from '../../styles';
import { useFontSize } from '../../components/ModalAgendamento/FontSizeContext';
import moment from "moment";
import consts from "../../consts";
import { useDispatch, useSelector } from "react-redux";
import { updateAgendamento, filterAgenda } from "../../store/modules/manicure/actions";

const Servico = ({ servico }) => {
    const dispatch = useDispatch();
    const { fontScale } = useFontSize();
    const { agendamento } = useSelector(state => state.manicure); // Estado do agendamento
    const [isSelected, setIsSelected] = useState(false); // Estado local para controle de seleção

    // Verifica se o serviço atual está selecionado
    const isServicoSelected = agendamento.servicoId === servico._id;

    // Convertendo timestamp para data correta e calculando a diferença de horas
    const duracao = moment(servico.duracao);
    const horas = duracao.hours();
    const minutos = duracao.minutes();

    // Ajuste a lógica de cálculo da duração
    let duracaoEmHoras = horas - 3; // Ajustar conforme necessário para calcular a diferença correta
    if (duracaoEmHoras < 0) duracaoEmHoras += 24; // Ajuste para garantir valores positivos

    // Formatar a duração corretamente, ocultando minutos se forem 0
    const duracaoCorrigida = minutos === 0 ? `${duracaoEmHoras}h` : `${duracaoEmHoras}h ${minutos}m`;

    // Função para selecionar/deselecionar o serviço
    const handleSelectServico = () => {
        if (isServicoSelected) {
            // Se o serviço já está selecionado, desmarque-o
            dispatch(updateAgendamento({ servicoId: null })); // Remove o serviço selecionado
            setIsSelected(false);
        } else {
            // Se o serviço não está selecionado, marque-o
            dispatch(updateAgendamento({ servicoId: servico._id })); // Atualiza o estado do agendamento
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
            onPress={handleSelectServico} // Seleciona/deseleciona o serviço ao clicar
        >
            <Cover 
                image={`${consts.bucketUrl}/${servico?.arquivos[0]?.caminho}`}
            />
            <Box direction="column">
                <Text bold color="dark" style={{ fontSize: 16 * fontScale }}>
                    {servico.titulo}
                </Text>
                <Text bold small color="dark" style={{ fontSize: 14 * fontScale }}>
                    R${servico.preco} • {duracaoCorrigida}
                </Text>
            </Box>
            <Box>
                <Button 
                    icon="clock-check-outline" 
                    background={isServicoSelected ? "#B159D6" : "light"} // Cor de fundo personalizada
                    mode="contained"
                    labelStyle={{ 
                        fontSize: 14 * fontScale,
                        color: isServicoSelected ? "#fff" : "#000", // Altera a cor do texto se selecionado
                    }}
                    accessibilityLabel="Agendar"
                    accessibilityHint="Dê um toque duplo para agendar um horário"
                    style={{ 
                        width: 'auto',
                        borderWidth: isServicoSelected ? 5 : 0, // Borda mais grossa (5px)
                        borderColor: isServicoSelected ? "#460071" : "transparent", // Cor da borda mais escura
                    }} 
                >
                    AGENDAR
                </Button>
            </Box>
        </Touchable>
    );
};

export default Servico;