import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { buscarClientesRequest, handleLoginSuccess } from '../store/modules/manicure/actions'; // Importe a ação

const LoginModal = ({ visible, onLoginSuccess }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { clientes } = useSelector(state => state.manicure); // Acessa a lista de clientes no estado

    // Busca os clientes ao abrir a modal
    useEffect(() => {
        if (visible) {
            dispatch(buscarClientesRequest()); // Despacha a ação para buscar clientes
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
            // Filtra o cliente com base no nome e telefone
            const clienteEncontrado = clientes.find(cliente => 
                cliente.nome.toLowerCase() === name.toLowerCase() && 
                cliente.telefone === phone
            );

            if (clienteEncontrado) {
                dispatch(handleLoginSuccess(clienteEncontrado)); // Despacha a ação de sucesso de login
                onLoginSuccess(clienteEncontrado); // Chama a função de sucesso
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
                    <Text style={styles.modalTitle}>Login</Text>
                    <Text style={styles.modalSubtitle}>Informe seus dados para continuar</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Nome Completo"
                        value={name}
                        onChangeText={setName}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Telefone com DDD (XX)XXXX-XXXX"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
});

export default LoginModal;