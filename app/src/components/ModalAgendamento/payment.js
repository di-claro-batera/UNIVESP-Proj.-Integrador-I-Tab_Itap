import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Image, StyleSheet } from 'react-native';
import util from '../../util';
import theme from '../../styles/theme.json';
import { Box, Text, Touchable } from '../../styles';
import { useFontSize } from './FontSizeContext'; // Importando o contexto do tamanho da fonte

const PaymentPicker = () => {
    const { fontScale } = useFontSize(); // Usando o contexto do tamanho da fonte

    return (
        <>
            <Text bold hasPadding color="dark" style={{ fontSize: 16 * fontScale }}>
                Qual a Forma de pagamento?
            </Text>
            <View style={styles.container}>
                <Touchable style={styles.touchable}>
                    <Box direction="row" align="center" style={styles.box}>
                        <Image 
                            source={{
                                uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/800px-Visa_Inc._logo.svg.png'
                            }}
                            style={styles.image}
                        />
                        <Text small style={[styles.cardText, { fontSize: 14 * fontScale }]}>4152 **** **** 0981</Text>
                    </Box>
                    <Icon name="cog-outline" color={theme.colors.muted} size={20} />
                </Touchable>
                <Touchable style={styles.touchable}>
                    <Box direction="row" align="center" style={styles.box}>
                        <Image 
                            source={{
                                uri: 'https://seeklogo.com/images/P/pix-banco-central-brasil-logo-700C1B323C-seeklogo.com.png'
                            }}
                            style={styles.image}
                        />
                        <Text small style={[styles.cardText, { fontSize: 14 * fontScale }]}>(016) 99999-1234</Text>
                    </Box>
                    <Icon name="cash" color={theme.colors.muted} size={20} />
                </Touchable>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    touchable: {
        height: 35, // Ajustando altura para garantir visibilidade
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: util.toAlpha(theme.colors.muted , 5),
        borderColor: util.toAlpha(theme.colors.muted, 40),
        borderWidth: 0.5,
        borderRadius: 5,
        marginVertical: 10,
    },
    image: {
        width: 45, // Ajuste para visibilidade
        height: 15, // Ajuste para visibilidade
        marginRight: 10,
    },
    cardText: {
        // Agora será ajustado dinamicamente
    },
    box: {
        flex: 1, // Garantir que o Box ocupe o espaço disponível
        justifyContent: 'flex-start', // Alinhamento à esquerda
    }
});

export default PaymentPicker;
