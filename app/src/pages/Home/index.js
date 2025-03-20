import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, Image } from 'react-native';
import theme from '../../styles/theme.json';
import util from '../../util';

import { useDispatch, useSelector } from 'react-redux';
import { getManicure, allServicos } from '../../store/modules/manicure/actions';

import Header from '../../components/Header';
import Servico from '../../components/Servico';
import ModalAgendamento from '../../components/ModalAgendamento';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FontSizeProvider } from '../../components/ModalAgendamento/FontSizeContext';
import LoginModal from '../../components/LoginModal'; // Importando a modal de login

const HomeContent = () => {
    const dispatch = useDispatch();
    const { servicos, form } = useSelector(state => state.manicure);

    // Estado para controlar a visibilidade da modal de login
    const [loginModalVisible, setLoginModalVisible] = useState(true);

    // Estado para controlar a visibilidade da modal de agendamento
    const [agendamentoModalVisible, setAgendamentoModalVisible] = useState(false);

    // Estado para verificar se o usuário está logado
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Filtra os serviços com base no input de busca
    const finalServicos = form.inputFiltro.length > 0 ? servicos.filter((s) => {
        const titulo = s.titulo.toLowerCase().trim();
        const arrSearch = form.inputFiltro.toLowerCase().trim().split(' ');
        return arrSearch.every((w) => titulo.search(w) !== -1);
    }) 
    : servicos;

    // Carrega os dados iniciais
    useEffect(() => {
        dispatch(getManicure());
        dispatch(allServicos());
    }, [dispatch]);

    // Função chamada quando o login é bem-sucedido
    const handleLoginSuccess = (cliente) => {
        setIsLoggedIn(true);
        setLoginModalVisible(false); // Fecha a modal de login
        setAgendamentoModalVisible(true); // Abre a modal de agendamento
        console.log('Cliente logado:', cliente);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {/* Modal de login */}
            <LoginModal
                visible={loginModalVisible}
                onLoginSuccess={handleLoginSuccess}
            />

            {/* Conteúdo da tela inicial */}
            {isLoggedIn ? (
                <FlatList
                contentContainerStyle={{
                    paddingTop: 0, // Remove o espaço acima da lista
                    paddingBottom: 0, // Remove o espaço abaixo da lista
                    margin: 0, // Remove margens gerais
                }}
                style={{
                    backgroundColor: util.toAlpha(theme.colors.muted, 10),
                    margin: 0, // Garante que o FlatList não tenha margem
                }}
                ListHeaderComponent={<Header />}
                data={finalServicos}
                renderItem={({ item }) => (<Servico servico={item} />)}
                keyExtractor={(item) => item._id}
            />
            
            ) : null}

            {/* Modal de agendamento */}
            <ModalAgendamento
                visible={agendamentoModalVisible}
                onRequestClose={() => setAgendamentoModalVisible(false)} // Fecha a modal de agendamento
            />
        </GestureHandlerRootView>
    );
};

const Home = () => (
    <FontSizeProvider>
        <HomeContent />
    </FontSizeProvider>
);

export default Home;