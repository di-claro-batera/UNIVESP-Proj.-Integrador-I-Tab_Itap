import 'react-native-gesture-handler';
import React from 'react';
import { AppRegistry, StyleSheet, View } from 'react-native'; // Importe StyleSheet e View
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Home from './src/pages/Home';
import { name as appName } from './app.json';
import { fonts } from './src/styles/theme.json';
import { Provider as StoreProvider } from 'react-redux';
import { DefaultTheme, configureFonts, Provider as PaperProvider } from 'react-native-paper';
import store from './src/store';
import './src/config/reactotron'; // Importar a configuração do Reactotron com o caminho correto

const theme = {
  ...DefaultTheme,
  fonts: configureFonts({
    ios: fonts,
    android: fonts,
  }),
};

const App = () => {
  return (
    <GestureHandlerRootView style={AppStyles.mainContainer}>
      <StoreProvider store={store}>
        <PaperProvider theme={theme}>
          <Home />
        </PaperProvider>
      </StoreProvider>
    </GestureHandlerRootView>
  );
};


const AppStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff', // Configuração de fundo transparente
  },
});

AppRegistry.registerComponent(appName, () => App);
