import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

// Definir los tipos de la navegación
type RootStackParamList = {
  Home: undefined;
  OtherScreen: undefined; // Agrega aquí las pantallas que usarás en tu Stack Navigator
};

// Definir props con el tipo correcto
type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text>Bienvenido a Traveling App</Text>
      <Button title="Ir a otra pantalla" onPress={() => navigation.navigate('OtherScreen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
