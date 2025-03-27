import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import CustomText from '@/components/CustomText';

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
      <CustomText style={styles.title}>Registrarse</CustomText>
      <CustomText style={styles.subtitle}>Crearse una cuenta es gratis</CustomText>

      <CustomText style={styles.label}>Nombre</CustomText>
      <TextInput
        placeholder="Tu nombre"
        placeholderTextColor="#999"
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
      />

      <CustomText style={styles.label}>Correo</CustomText>
      <TextInput
        placeholder="youremail@yahoo.com"
        placeholderTextColor="#999"
        keyboardType="email-address"
        style={styles.input}
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
      />

      <CustomText style={styles.label}>Contraseña</CustomText>
      <TextInput
        placeholder="********"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
      />

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <CustomText style={styles.registerButtonText}>Registrarse</CustomText>
      </TouchableOpacity>

      <CustomText style={styles.or}>─ O ─</CustomText>

      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialBtn}><CustomText>G</CustomText></TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}><CustomText>X</CustomText></TouchableOpacity>
      </View>

      <CustomText style={styles.footerText}>
        ¿Ya tienes una cuenta?{' '}
        <CustomText style={styles.loginLink} onPress={() => router.push('/login')}>
          Iniciar sesión
        </CustomText>
      </CustomText>
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
  or: { textAlign: 'center', color: '#888', marginVertical: 10 },
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
});