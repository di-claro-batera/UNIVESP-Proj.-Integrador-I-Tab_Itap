import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Image, StyleSheet, Alert, Modal, TextInput, ScrollView, Clipboard, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import util from '../../util';
import theme from '../../styles/theme.json';
import { Box, Text, Touchable } from '../../styles';
import { useFontSize } from './FontSizeContext'; // Importando o contexto do tamanho da fonte
import api from '../../services/api'; // Importando sua instância do axios

// Importando a imagem do QR Code
import qrCodeImage from '../../assets/images/codigoQR.jpg'; // Ajuste o caminho conforme necessário

const PaymentPicker = ({ agendamento, servico }) => {
    const { fontScale } = useFontSize(); // Usando o contexto do tamanho da fonte
    const [loading, setLoading] = useState(false);
    const [checkoutUrl, setCheckoutUrl] = useState(null); // URL do checkout
    const [modalVisible, setModalVisible] = useState(false); // Controle do modal
    const [pixModalVisible, setPixModalVisible] = useState(false); // Controle do modal do PIX

    // Código PIX "copia e cola"
    const pixCode = "00020126430014br.gov.bcb.pix0114+55169977517190203Pix5204000053039865802BR5915MARINEUZA PIRES6009TABATINGA62290525UyKR7DbBQ6elXSGAz3644JDCe6304D8D8";

    // Função para copiar o código PIX
    const copyPixCode = () => {
        Clipboard.setString(pixCode);
        Alert.alert('Sucesso', 'Código PIX copiado para a área de transferência!');
    };

    // Função para abrir o WhatsApp
    const openWhatsApp = () => {
        const phoneNumber = "5516997751719"; // Número de telefone no formato internacional (sem espaços ou caracteres especiais)
        const message = "Olá, aqui está o comprovante do pagamento PIX."; // Mensagem padrão
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        Linking.openURL(url).catch(() => {
            Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
        });
    };

    // Verifica se o serviço e o agendamento estão definidos
    if (!servico || !agendamento) {
        return (
            <Box align="center" hasPadding>
                <Text style={{ fontSize: 16 * fontScale }}>
                    Nenhum serviço selecionado.
                </Text>
            </Box>
        );
    }

    // Função para criar a preferência de pagamento
    const handlePayment = async () => {
        setLoading(true);

        try {
            // Access Token do MercadoPago
            const accessToken = 'APP_USR-4664714789132333-031615-be4140c4538fb838b339cb45f89763d0-139857340';

            // Dados da preferência de pagamento
            const preferenceData = {
                items: [
                    {
                        title: servico.titulo, // Nome do serviço dinâmico
                        quantity: 1,
                        currency_id: 'BRL', // Moeda (Real Brasileiro)
                        unit_price: servico.preco, // Preço dinâmico
                    },
                ],
                payer: {
                    email: 'cliente@example.com', // E-mail fixo (substitua pelo necessário)
                },
            };

            // Cria a preferência de pagamento
            const response = await api.post(
                'https://api.mercadopago.com/checkout/preferences',
                preferenceData,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Verifica se a URL de checkout foi retornada corretamente
            if (response.data && response.data.init_point) {
                console.log('Checkout URL:', response.data.init_point); // Log para depuração
                setCheckoutUrl(response.data.init_point);
                setModalVisible(true);
            } else {
                throw new Error('URL de checkout não retornada pela API do Mercado Pago.');
            }
        } catch (error) {
            console.error('Erro ao criar preferência de pagamento:', error.response ? error.response.data : error.message);
            Alert.alert('Erro', 'Erro ao processar o pagamento. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Função para capturar o resultado do pagamento
    const handleWebViewNavigationStateChange = (navState) => {
        const { url } = navState;

        // Verifica se o pagamento foi concluído
        if (url.includes('approved')) {
            setModalVisible(false);
            Alert.alert('Sucesso', 'Pagamento aprovado! Obrigado pela compra.');
        } else if (url.includes('failure')) {
            setModalVisible(false);
            Alert.alert('Erro', 'Pagamento recusado. Tente novamente.');
        } else if (url.includes('pending')) {
            setModalVisible(false);
            Alert.alert('Aviso', 'Pagamento pendente. Aguarde a confirmação.');
        }
    };

    return (
        <>
            <Text bold hasPadding color="dark" style={{ fontSize: 16 * fontScale }}>
                Qual a Forma de pagamento?
            </Text>
            <View style={styles.container}>
                {/* Touchable para pagamento com cartão */}
                <Touchable 
                    style={styles.touchable} 
                    onPress={handlePayment} 
                    disabled={loading}
                >
                    <Box direction="row" align="center" style={styles.box}>
                        <Image 
                            source={{
                                uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/800px-Visa_Inc._logo.svg.png'
                            }}
                            style={styles.image}
                        />
                        <Text small style={[styles.cardText, { fontSize: 14 * fontScale }]}>
                            Pagar com Cartão
                        </Text>
                    </Box>
                    <Icon name="chevron-right" color={theme.colors.muted} size={20} />
                </Touchable>

                {/* Touchable para pagamento com PIX */}
                <Touchable 
                    style={styles.touchable} 
                    onPress={() => setPixModalVisible(true)} 
                    disabled={loading}
                >
                    <Box direction="row" align="center" style={styles.box}>
                        <Image 
                            source={{
                                uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo%E2%80%94pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.svg/1280px-Logo%E2%80%94pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.svg.png'
                            }}
                            style={styles.image}
                        />
                        <Text small style={[styles.cardText, { fontSize: 14 * fontScale }]}>
                            Pagar com PIX
                        </Text>
                    </Box>
                    <Icon name="chevron-right" color={theme.colors.muted} size={20} />
                </Touchable>
            </View>

            {/* Modal com WebView para o checkout */}
            <Modal
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                animationType="slide"
            >
                {checkoutUrl && (
                    <WebView
                        source={{ uri: checkoutUrl }}
                        onNavigationStateChange={handleWebViewNavigationStateChange}
                        startInLoadingState={true}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                    />
                )}
            </Modal>

            {/* Modal para pagamento com PIX */}
            <Modal
                visible={pixModalVisible}
                onRequestClose={() => setPixModalVisible(false)}
                animationType="slide"
            >
                <ScrollView contentContainerStyle={styles.pixModalContainer}>
                    <Text bold style={{ fontSize: 18 * fontScale, marginBottom: 20 }}>
                        Pagamento via PIX
                    </Text>
                    <Image 
                        source={qrCodeImage} // Usando a imagem local do QR Code
                        style={styles.qrCode}
                    />
                    <Text style={{ fontSize: 14 * fontScale, marginTop: 20 }}>
                        Ou copie o código abaixo:
                    </Text>
                    <TextInput
                        style={styles.pixCodeInput}
                        value={pixCode} // Usando o código PIX fornecido
                        editable={false}
                        multiline={true}
                    />
                    <Touchable 
                        style={styles.copyButton} 
                        onPress={copyPixCode} // Função para copiar o código PIX
                    >
                        <Text style={{ color: 'white', fontSize: 14 * fontScale }}>
                            Copiar Código PIX
                        </Text>
                    </Touchable>

                    {/* Mensagem para enviar comprovante */}
                    <Text style={{ fontSize: 14 * fontScale, marginTop: 20, textAlign: 'center' }}>
                        Por favor, envie o comprovante para o WhatsApp {' '}
                        <Text 
                            style={{ color: theme.colors.primary, fontWeight: 'bold' }} 
                            onPress={openWhatsApp} // Abre o WhatsApp ao tocar no número
                        >
                            (16) 99775-1719
                        </Text>
                        {' '}para confirmar o pagamento.
                    </Text>
                </ScrollView>
            </Modal>
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
    },
    pixModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    qrCode: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    pixCodeInput: {
        width: '100%',
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        textAlign: 'center',
        fontSize: 14,
    },
    copyButton: {
        marginTop: 20,
        backgroundColor: theme.colors.primary,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
});

export default PaymentPicker;