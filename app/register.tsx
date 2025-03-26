import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión');
        router.push('/login');
      } else {
        Alert.alert('Error', data.error || 'No se pudo registrar');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema con el registro');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      <Text style={styles.subtitle}>Crearse una cuenta es gratis</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        placeholder="Tu nombre"
        placeholderTextColor="#999"
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
      />

      <Text style={styles.label}>Correo</Text>
      <TextInput
        placeholder="youremail@yahoo.com"
        placeholderTextColor="#999"
        keyboardType="email-address"
        style={styles.input}
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        placeholder="********"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
      />

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Registrarse</Text>
      </TouchableOpacity>

      <Text style={styles.or}>─ O ─</Text>

      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialBtn}><Text>G</Text></TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}><Text>X</Text></TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        ¿Ya tienes una cuenta?{' '}
        <Text style={styles.loginLink} onPress={() => router.push('/login')}>
          Iniciar sesión
        </Text>
      </Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f9ff',
      paddingTop: 60,
      paddingHorizontal: 20,
    },
    card: {
      backgroundColor: '#eaf3ff',
      borderRadius: 30,
      padding: 20,
      width: '100%',
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#468cd1',
      marginBottom: 8,
    },
    subtitle: {
      color: '#333',
      marginBottom: 20,
    },
    label: {
      marginTop: 10,
      marginBottom: 4,
      fontWeight: '600',
      color: '#444',
    },
    input: {
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      marginBottom: 12,
    },
    registerButton: {
      backgroundColor: '#468cd1',
      padding: 15,
      borderRadius: 30,
      marginTop: 15,
      alignItems: 'center',
    },
    registerButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    divider: {
      borderBottomWidth: 1,
      borderColor: '#ccc',
      width: '100%',
      marginVertical: 20,
    },
    socialButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
    },
    socialBtn: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 10,
      elevation: 2,
      marginHorizontal: 10,
    },
    footerText: {
        color: '#888',
        textAlign: 'center',
    },
    loginLink: {
      fontWeight: 'bold',
      color: '#468cd1',
    },
    or: { textAlign: 'center', color: '#888', marginVertical: 10 },
  });
  
  