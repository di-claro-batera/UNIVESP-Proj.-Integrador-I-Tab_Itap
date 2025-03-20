import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Image, StyleSheet, Alert, Modal, TextInput, ScrollView, Clipboard, Linking, TouchableOpacity } from 'react-native';
import util from '../../util';
import theme from '../../styles/theme.json';
import { Box, Text, Touchable } from '../../styles'; // Touchable personalizado para os botões de pagamento
import { useFontSize } from './FontSizeContext'; // Importando o contexto do tamanho da fonte
import api from '../../services/api'; // Importando sua instância do axios
import InAppBrowser from 'react-native-inappbrowser-reborn'; // Biblioteca para abrir links no navegador integrado

// Importando a imagem do QR Code
import qrCodeImage from '../../assets/images/codigoQR.jpg'; // Ajuste o caminho conforme necessário

const PaymentPicker = ({ agendamento, servico }) => {
    const { fontScale } = useFontSize(); // Usando o contexto do tamanho da fonte
    const [loading, setLoading] = useState(false);
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

    const handlePayment = async () => {
        setLoading(true);
      
        try {
          const accessToken = 'APP_USR-4664714789132333-031615-be4140c4538fb838b339cb45f89763d0-139857340';
      
          const preferenceData = {
            items: [
              {
                title: servico.titulo,
                quantity: 1,
                currency_id: 'BRL',
                unit_price: servico.preco,
              },
            ],
            payer: {
              email: 'cliente@example.com',
            },
          };
      
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
      
          if (response.data && response.data.init_point) {
            console.log('Checkout URL:', response.data.init_point); // Log para depuração
      
            // Verifica se o InAppBrowser está disponível
            if (await InAppBrowser.isAvailable()) {
              await InAppBrowser.open(response.data.init_point, {
                dismissButtonStyle: 'close',
                preferredBarTintColor: theme.colors.primary,
                preferredControlTintColor: 'white',
              });
            } else {
              // Se o InAppBrowser não estiver disponível, tenta abrir com Linking
              const canOpen = await Linking.canOpenURL(response.data.init_point);
              if (canOpen) {
                await Linking.openURL(response.data.init_point);
              } else {
                Alert.alert('Erro', 'Não foi possível abrir o navegador.');
              }
            }
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

    // Verifica se o serviço e o agendamento estão definidos
    if (!servico || !agendamento) {
        return (
            <Box align="center" hasPadding>
                <Text style={{ fontSize: 16 * fontScale, fontFamily: theme.fonts.regular.fontFamily }}>
                    Nenhum serviço selecionado.
                </Text>
            </Box>
        );
    }

    return (
        <>
            <Text bold hasPadding color="dark" style={{ fontSize: 16 * fontScale, fontFamily: theme.fonts.regular.fontFamily }}>
                Qual a Forma de pagamento?
            </Text>
            <View style={styles.container}>
                {/* Touchable personalizado para pagamento com cartão */}
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
                        <Text small style={[styles.cardText, { fontSize: 14 * fontScale, fontFamily: theme.fonts.regular.fontFamily }]}>
                            Pagar com Cartão
                        </Text>
                    </Box>
                    <Icon name="chevron-right" color={theme.colors.muted} size={20} />
                </Touchable>

                {/* Touchable personalizado para pagamento com PIX */}
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
                        <Text small style={[styles.cardText, { fontSize: 14 * fontScale, fontFamily: theme.fonts.regular.fontFamily }]}>
                            Pagar com Pix
                        </Text>
                    </Box>
                    <Icon name="chevron-right" color={theme.colors.muted} size={20} />
                </Touchable>
            </View>

            {/* Modal para pagamento com PIX */}
            <Modal
                visible={pixModalVisible}
                onRequestClose={() => setPixModalVisible(false)}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView contentContainerStyle={styles.scrollViewContent}>
                            <Box hasPadding direction="column">
                                <Text bold color="dark" style={[styles.modalTitle, { fontFamily: theme.fonts.bold.fontFamily }]}>
                                    Pagamento via Pix
                                </Text>
                                <Text small style={[styles.modalSubtitle, { fontFamily: theme.fonts.regular.fontFamily }]}>
                                    Escaneie o QR Code ou copie o código abaixo:
                                </Text>

                                <Image 
                                    source={qrCodeImage} // Usando a imagem local do QR Code
                                    style={styles.qrCode}
                                />

                                {/* Campo de texto para exibir o código PIX */}
                                <View style={styles.pixCodeContainer}>
                                    <TextInput
                                        style={[styles.pixCodeInput, { fontFamily: theme.fonts.regular.fontFamily }]}
                                        value={pixCode} // Usando o código PIX fornecido
                                        editable={false}
                                        multiline={true}
                                    />
                                    <TouchableOpacity 
                                        style={styles.copyIcon} 
                                        onPress={copyPixCode} // Função para copiar o código PIX
                                    >
                                        <Icon name="content-copy" size={20} color={theme.colors.primary} />
                                    </TouchableOpacity>
                                </View>

                                {/* Botão para copiar o código PIX */}
                                <TouchableOpacity 
                                    style={styles.copyButton} 
                                    onPress={copyPixCode} // Função para copiar o código PIX
                                >
                                    <Text bold color="light" style={{ fontFamily: theme.fonts.bold.fontFamily }}>
                                        Copiar Código Pix
                                    </Text>
                                </TouchableOpacity>

                                <Text small style={[styles.whatsappText, { fontFamily: theme.fonts.regular.fontFamily }]}>
                                    Por favor, envie o comprovante para o WhatsApp {' '}
                                    <Text 
                                        bold 
                                        color="primary" 
                                        onPress={openWhatsApp} // Abre o WhatsApp ao tocar no número
                                        style={{ fontFamily: theme.fonts.bold.fontFamily }}
                                    >
                                        (16) 99775-1719
                                    </Text>
                                    {' '}para confirmar o pagamento.
                                </Text>
                            </Box>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    touchable: {
        height: 50, // Altura ajustada para melhor visualização
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: util.toAlpha(theme.colors.muted, 5),
        borderColor: util.toAlpha(theme.colors.muted, 40),
        borderWidth: 0.5,
        borderRadius: 5,
        marginVertical: 10,
        width: '100%', // Garante que o botão ocupe a largura total
    },
    image: {
        width: 45, // Ajuste para visibilidade
        height: 15, // Ajuste para visibilidade
        marginRight: 10,
    },
    cardText: {
        flex: 1, // Garante que o texto ocupe o espaço disponível
    },
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Garantir que o Box ocupe o espaço disponível
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
    },
    scrollViewContent: {
        paddingVertical: 20,
    },
    modalTitle: {
        fontSize: 22,
        marginBottom: 10,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
    },
    qrCode: {
        width: 200,
        height: 200,
        marginBottom: 20,
        alignSelf: 'center',
    },
    pixCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
    },
    pixCodeInput: {
        flex: 1,
        fontSize: 14,
    },
    copyIcon: {
        marginLeft: 10,
    },
    copyButton: {
        width: '100%', // Ocupa a largura total do container
        backgroundColor: theme.colors.primary,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    whatsappText: {
        marginTop: 20,
        textAlign: 'center',
    },
});

export default PaymentPicker;