import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { buscarClientesRequest, handleLoginSuccess } from '../store/modules/manicure/actions';
import theme from '../styles/theme.json'; // Importe o tema
import { Box } from '../styles'; // Importe o componente Box

const LoginModal = ({ visible, onLoginSuccess }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { clientes } = useSelector(state => state.manicure);

    useEffect(() => {
        if (visible) {
            dispatch(buscarClientesRequest());
        }
    }, [visible]);

    const handleLogin = async () => {
        if (!name || !phone) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const clienteEncontrado = clientes.find(cliente => 
                cliente.nome.toLowerCase() === name.toLowerCase() && 
                cliente.telefone === phone
            );

            if (clienteEncontrado) {
                dispatch(handleLoginSuccess(clienteEncontrado));
                onLoginSuccess(clienteEncontrado);
            } else {
                setError('Cliente não encontrado. Verifique os dados e tente novamente.');
            }
        } catch (err) {
            console.error('Erro ao buscar cliente:', err);
            setError('Erro ao buscar cliente. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setError('Você precisa fazer login para continuar.')}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <View style={styles.container}>
                            {/* Texto "Login" com o mesmo estilo de "Finalizar Agendamento" */}
                            <Text style={styles.modalTitle}>Seja Bem Vindo!</Text>
                            {/* Texto "Informe seus dados para continuar" com o mesmo estilo de "Escolha horário e método de pagamento" */}
                            <Text style={styles.modalSubtitle}>Informe seus dados para continuar</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Nome Completo"
                                placeholderTextColor="#666"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                                autoCorrect={false}
                                keyboardType="default"
                                color="#000"
                                selectionColor={theme.colors.primary}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Telefone com DDD (XX)XXXX-XXXX"
                                placeholderTextColor="#666"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                color="#000"
                                selectionColor={theme.colors.primary}
                            />

                            {error ? (
                                <Text style={styles.errorText}>{error}</Text>
                            ) : null}

                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                <Text style={styles.loginButtonText}>
                                    {loading ? 'Carregando...' : 'Entrar'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
    container: {
        padding: 20, // Adicionei um padding para garantir espaçamento interno
    },
    modalTitle: {
        color: theme.colors.dark, // Cor do tema
        fontSize: 28, // Mesmo tamanho de "Finalizar Agendamento"
        fontFamily: "Pattaya-Regular", // Mesma fonte de "Finalizar Agendamento"
        textAlign: 'center', // Centralizado
        marginBottom: 10, // Espaçamento inferior
    },
    modalSubtitle: {
        color: theme.colors.dark, // Cor do tema
        fontSize: 18, // Mesmo tamanho de "Escolha horário e método de pagamento"
        fontFamily: "PragatiNarrow-Regular", // Mesma fonte de "Escolha horário e método de pagamento"
        textAlign: 'center', // Centralizado
        marginBottom: 20, // Espaçamento inferior
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
        color: '#000',
        fontSize: 16,
    },
    loginButton: {
        width: '100%',
        backgroundColor: theme.colors.primary,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
    },
    errorText: {
        color: theme.colors.danger,
        fontSize: 14,
        marginBottom: 10,
    },
});

export default LoginModal;