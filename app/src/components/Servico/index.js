import React from "react";
import { Text, Box, Touchable, Cover, Button } from '../../styles';
import { useFontSize } from '../../components/ModalAgendamento/FontSizeContext'; // Importando o contexto do tamanho da fonte

const Servico = () => {
    const { fontScale } = useFontSize(); // Usando o contexto do tamanho da fonte

    return (
        <Touchable 
            height="100px" 
            background="light"
            align="center"
            hasPadding
        >
            <Cover 
                image="https://www.coloramaesmaltes.com.br/-/media/Project/Loreal/Brand-Sites/Essie/MASTER/DMI/articles/tips_trends/Como-ser-uma-manicure-de-sucesso-Confira-dicas/manicure-de-sucesso.jpg?h=600&w=600&la=en&hash=87FFF505A9D06ABBE500C0DCC43916FB6B05D577"
            />
            <Box direction="column">
                <Text bold color="dark" style={{ fontSize: 14 * fontScale }}>Manicure</Text>
                <Text bold small color="dark" style={{ fontSize: 12 * fontScale }}>R$40,00 • 45mins</Text>
            </Box>
            <Box>
                <Button 
                    icon="clock-check-outline" 
                    background="sucess" 
                    mode="contained"
                    labelStyle={{ fontSize: 14 * fontScale }}
                    accessibilityLabel="Agendar"
                    accessibilityHint="Dê um toque duplo para agendar um horário"
                    style={{ width: 'auto' }} // Garantindo que o botão se adapte ao tamanho do texto
                >
                    AGENDAR
                </Button>
            </Box>
        </Touchable>
    );
};

export default Servico;
