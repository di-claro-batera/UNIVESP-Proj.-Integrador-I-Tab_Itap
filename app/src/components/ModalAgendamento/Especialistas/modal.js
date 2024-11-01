import React from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { Text, Box, Touchable, Cover } from '../../../styles';
import theme from '../../../styles/theme.json';
import util from '../../../util';

const EspecialistaModal = ({ isVisible, onClose }) => {
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            style={styles.modal}
        >
            <View style={styles.modalContent}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <Box hasPadding direction="column">
                        <Text bold color="dark">Manicure</Text>
                        <Text style={styles.subText} small>Disponível em 15/12/2024 (Dom) às 07:00</Text>
                        <Box wrap="wrap" spacing="10px 0 0">
                            {[1, 2].map(colaborador => (
                                <Touchable
                                    key={colaborador} // Adicionando key para cada item
                                    height="70px"
                                    spacing="10px 0px 10px 0px" // Ajuste de espaçamento
                                    direction="row" // Direção da row para alinhar o texto ao lado
                                    align="center"
                                    width="100%" // Ajustando a largura para ocupar 100%
                                >
                                    <Cover 
                                        width="75px"
                                        height="75px"
                                        circle
                                        border={colaborador === 1 ? `2px solid ${theme.colors.primary}` : 'none'}
                                        spacing="0px 10px 0px 0px" // Espaçamento à direita
                                        image="https://www.primecursos.com.br/arquivos/uploads/2013/08/manicure-pedicure.jpg"
                                    />
                                    <Box direction="column" align="flex-start">
                                        <Text bold>Marineuza</Text>
                                        <Text style={styles.subText}>Atendimento a Domicílio</Text>
                                    </Box>
                                </Touchable>
                            ))}
                        </Box>
                    </Box>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 0,
    },
    subText: {
        fontFamily: theme.fonts.light.fontFamily, // Fonte personalizada para subtítulo
        fontSize: 16,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    scrollViewContent: {
        paddingVertical: 20,
    },
});

export default EspecialistaModal;
