import React from 'react';
import { FlatList, View, Text } from 'react-native';
import theme from '../../styles/theme.json';
import util from '../../util';
import Header from '../../components/Header';
import Servico from '../../components/Servico';
import ModalAgendamento from '../../components/ModalAgendamento';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FontSizeProvider } from '../../components/ModalAgendamento/FontSizeContext'; // Importando FontSizeProvider

const HomeContent = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <FlatList
                style={{ backgroundColor: util.toAlpha(theme.colors.muted, 10) }}
                ListHeaderComponent={Header}
                data={['a', 'b', 'c', 'd', 'e']}
                renderItem={({ item }) => (<Servico key={item} />)}
                keyExtractor={(item) => item}
            />
            <ModalAgendamento />
        </GestureHandlerRootView>
    );
};

const Home = () => (
    <FontSizeProvider>
        <HomeContent />
    </FontSizeProvider>
);

export default Home;
