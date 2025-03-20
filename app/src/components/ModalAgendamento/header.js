import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { Box, Spacer } from '../../styles';
import theme from '../../styles/theme.json';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ModalHeader = () => {
  const windowWidth = Dimensions.get('window').width;
  return (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={['#6750A4', '#B45BD9']}
        style={[styles.gradientView, { width: windowWidth }]} // Ajuste a largura
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.touchable}>
            <Icon name="chevron-left" color={theme.colors.light} size={30} />
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Finalizar Agendamento</Text>
            <Text style={styles.subtitle}>Escolha horário e método de pagamento</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 90,
    backgroundColor: 'rgb(255, 255, 255)', // Define como transparente
  },
  gradientView: {
    flex: 1,
    padding: 20,
    borderRadius: 1,
    justifyContent: 'center', // Centralize o conteúdo verticalmente
    backgroundColor: 'rgb(255, 255, 255)', // Define como transparente
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center', // Alinha ícone e textos horizontalmente
  },
  textContainer: {
    flex: 1,
    marginLeft: 20,
  },
  title: {
    color: theme.colors.light,
    fontSize: 26,
    fontFamily: "Pattaya-Regular",
  },
  subtitle: {
    color: theme.colors.light,
    fontSize: 16,
    fontFamily: "PoiretOne-Regular",
  },
});

export default ModalHeader;
