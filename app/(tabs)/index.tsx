import { useRouter } from 'expo-router';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const router = useRouter(); // Para manejar la navegación

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a la App de Viajes</Text>
      <Text style={styles.subtitle}>Haz clic en el botón para ver la información de un vuelo.</Text>
      <Button 
        title="Ver Información del Vuelo"
        onPress={() => router.push({ pathname: '/screens/InformacionScreen', params: { id: '1' } })}
      />
    </View>
  );
}

// 🎨 Estilos de la pantalla
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 20, textAlign: 'center' },
});
