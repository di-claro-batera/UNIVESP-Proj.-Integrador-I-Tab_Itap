import React, { useEffect } from 'react';
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

const HomeContent = () => {
    const dispatch = useDispatch();
    const { servicos, form } = useSelector(state => state.manicure);

    const finalServicos = form.inputFiltro.length > 0 ? servicos.filter((s) => {
        const titulo = s.titulo.toLowerCase().trim();
        const arrSearch = form.inputFiltro.toLowerCase().trim().split(' ');
        return arrSearch.every((w) => titulo.search(w) !== -1);
    }) 
    : servicos;

    useEffect(() => {
        dispatch(getManicure());
        dispatch(allServicos());
    }, [dispatch]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <FlatList
                style={{ backgroundColor: util.toAlpha(theme.colors.muted, 10) }}
                ListHeaderComponent={<Header />}
                data={finalServicos}
                renderItem={({ item }) => (<Servico servico={item} key={item} />)}
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
